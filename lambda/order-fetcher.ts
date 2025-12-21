/**
 * Order Data Fetcher
 * 
 * Fetches complete order information from DynamoDB including:
 * - Order details
 * - Customer information
 * - Shipping address
 * - Order items
 * 
 * This data is used to create shipments via Shiprocket API
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export interface OrderData {
  // Order info
  id: string;
  createdAt: string;
  customerId: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddressId: string;
  orderItems: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  
  // Customer info (from Customers table)
  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
  };
  
  // Shipping address (from Addresses table)
  shippingAddress: {
    line1: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    receiverName?: string;
    receiverPhone?: string;
  };
  
  // Calculated fields
  date: string;
  subTotal: number;
  weight: number;
  isPaid: boolean;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Fetch complete order data from DynamoDB
 * 
 * @param orderId - The order ID to fetch
 * @param createdAt - The order creation timestamp (sort key)
 * @returns Complete order data ready for shipment creation
 */
export async function getOrderWithDetails(orderId: string, createdAt: string): Promise<OrderData | null> {
  try {
    // 1. Get Order
    const orderResult = await docClient.send(new GetCommand({
      TableName: process.env.ORDERS_TABLE_NAME || 'table-tennis-orders',
      Key: {
        orderId,
        createdAt,
      },
    }));

    if (!orderResult.Item) {
      console.error(`[order-fetcher] Order not found: ${orderId}`);
      return null;
    }

    const order = orderResult.Item;

    // 2. Get Customer
    const customerResult = await docClient.send(new GetCommand({
      TableName: process.env.CUSTOMERS_TABLE_NAME || 'table-tennis-customers',
      Key: {
        customerId: order.customerId,
      },
    }));

    if (!customerResult.Item) {
      console.error(`[order-fetcher] Customer not found: ${order.customerId}`);
      return null;
    }

    const customer = customerResult.Item;

    // 3. Get Shipping Address
    const addressResult = await docClient.send(new GetCommand({
      TableName: process.env.ADDRESSES_TABLE_NAME || 'table-tennis-addresses',
      Key: {
        addressId: order.shippingAddressId,
        ownerId: order.customerId,
      },
    }));

    if (!addressResult.Item) {
      console.error(`[order-fetcher] Address not found: ${order.shippingAddressId}`);
      return null;
    }

    const address = addressResult.Item;

    // 4. Assemble complete order data
    const orderData: OrderData = {
      // Order fields
      id: order.orderId,
      createdAt: order.createdAt,
      customerId: order.customerId,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddressId: order.shippingAddressId,
      orderItems: order.orderItems || [],
      
      // Customer fields
      customer: {
        firstName: customer.firstName || customer.name?.split(' ')[0] || 'Customer',
        lastName: customer.lastName || customer.name?.split(' ').slice(1).join(' '),
        email: customer.email,
        phone: customer.phone || customer.phoneNumber,
      },
      
      // Shipping address fields
      shippingAddress: {
        line1: address.Address || address.address,
        city: address.City || address.city,
        pincode: address.Pincode || address.pincode,
        state: address.State || address.state || 'Maharashtra', // Default fallback
        country: address.Country || address.country || 'India', // Default fallback
        receiverName: address.ReceiversName || address.receiverName,
        receiverPhone: address.ReceiversNumber || address.receiverPhone,
      },
      
      // Calculated/formatted fields for Shiprocket
      date: order.createdAt,
      subTotal: order.totalAmount,
      weight: calculateOrderWeight(order.orderItems),
      isPaid: order.paymentStatus === 'paid',
      items: (order.orderItems || []).map((item: any) => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log(`[order-fetcher] Successfully fetched order ${orderId} with complete details`);
    return orderData;

  } catch (error) {
    console.error(`[order-fetcher] Error fetching order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Calculate total weight of order items
 * Default to 0.5kg per item if weight not specified
 */
function calculateOrderWeight(orderItems: any[]): number {
  if (!orderItems || orderItems.length === 0) {
    return 0.5; // Default minimum weight
  }
  
  return orderItems.reduce((total, item) => {
    const itemWeight = item.weight || 0.5; // Default 0.5kg per item
    return total + (itemWeight * item.quantity);
  }, 0);
}

export default { getOrderWithDetails };
