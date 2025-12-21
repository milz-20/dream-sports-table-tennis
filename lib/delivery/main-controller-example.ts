/**
 * Example Main Controller
 * 
 * This demonstrates how the main controller will use runDelivery
 * with the storage adapter to prevent duplicate shipments.
 * 
 * Flow:
 * 1. Order payment completed
 * 2. Call runDelivery with storage adapter
 * 3. runDelivery checks DynamoDB (or mock) for existing delivery
 * 4. If null → creates shipment + pickup
 * 5. If exists → returns cached result (prevents duplicate)
 * 6. Main controller receives result and updates order status
 */

import { runDelivery } from './delivery-controller';
import { createDynamoAdapter } from './storage-adapter-dynamo';
// import storageAdapter from './storage-adapter-mock'; // Use mock for local testing

// Use real DynamoDB adapter (comment out for local testing with mock)
const storageAdapter = createDynamoAdapter(); // Uses 'table-tennis-shipments' by default

type Order = {
  id: string;
  date: string;
  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    line1: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subTotal: number;
  weight?: number;
  paymentMethod?: string;
  isPaid?: boolean;
};

/**
 * Main delivery orchestration function
 * Called when payment is completed
 */
export async function handleOrderDelivery(order: Order): Promise<{
  success: boolean;
  orderId: string;
  deliveryStatus: string;
  shipmentId?: string;
  awb?: string;
  pickupId?: string;
  error?: string;
}> {
  console.log(`[main-controller] Processing delivery for order ${order.id}`);

  try {
    // Call runDelivery with storage adapter
    // This will:
    // 1. Check if delivery already exists in DynamoDB
    // 2. If yes → return cached result (prevent duplicate)
    // 3. If no → create shipment + pickup, save to DynamoDB
    const result = await runDelivery(order, {
      storage: storageAdapter, // Replace with real DynamoDB adapter later
      notifyPhone: order.customer.phone,
    });

    if (!result.ok) {
      console.error(`[main-controller] Delivery failed for ${order.id}:`, result.error);
      return {
        success: false,
        orderId: order.id,
        deliveryStatus: 'failed',
        error: result.error,
      };
    }

    // Extract shipment details from result
    const shipmentId = result.shiprocket?.data?.shipment_id 
      || result.shiprocket?.shipment_id 
      || result.shiprocket?.id;
    
    const awb = result.shiprocket?.data?.awb_code 
      || result.shiprocket?.awb_code;
    
    const pickupId = result.pickup?.data?.pickup_id 
      || result.pickup?.pickup_id;

    console.log(`[main-controller] Delivery processed for ${order.id}:`, {
      fromCache: result.fromCache || false,
      shipmentId,
      awb,
      pickupId,
    });

    // TODO: Update order record in your orders table with delivery status
    // Example:
    // await updateOrderRecord(order.id, {
    //   deliveryStatus: 'shipped',
    //   shipmentId,
    //   awb,
    //   pickupScheduled: true,
    // });

    return {
      success: true,
      orderId: order.id,
      deliveryStatus: result.fromCache ? 'already_shipped' : 'shipped',
      shipmentId,
      awb,
      pickupId,
    };

  } catch (err: any) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[main-controller] Exception processing delivery for ${order.id}:`, errorMessage);
    
    // TODO: Create alert/notification for ops team
    
    return {
      success: false,
      orderId: order.id,
      deliveryStatus: 'error',
      error: errorMessage,
    };
  }
}

export default { handleOrderDelivery };
