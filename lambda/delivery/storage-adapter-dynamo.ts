/**
 * DynamoDB Storage Adapter for Delivery/Shipment Records
 * 
 * This adapter uses the existing `table-tennis-shipments` DynamoDB table
 * to store delivery status and prevent duplicate shipments.
 * 
 * Table schema (from lib/table-interfaces.ts):
 * - PK: shipmentId (UUID)
 * - SK: orderId (FK to Orders table)
 * - Fields: customerId, shiprocketOrderId, trackingNumber, status, courierName, etc.
 * 
 * Usage:
 * ```
 * import { createDynamoAdapter } from './lib/delivery/storage-adapter-dynamo';
 * const storage = createDynamoAdapter('table-tennis-shipments');
 * const result = await runDelivery(order, { storage });
 * ```
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand,
  QueryCommand 
} from '@aws-sdk/lib-dynamodb';

export interface ShipmentRecord {
  shipmentId: string; // PK
  orderId: string; // SK
  customerId: string;
  shiprocketOrderId?: string;
  trackingNumber?: string; // AWB
  trackingUrl?: string;
  status: 'pending' | 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  courierName?: string;
  shippingCost?: number;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  // Raw Shiprocket responses
  shiprocketResponse?: any;
  pickupResponse?: any;
  error?: string;
}

export class DynamoStorageAdapter {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string, region = process.env.AWS_REGION || 'ap-south-1') {
    const ddbClient = new DynamoDBClient({ region });
    this.client = DynamoDBDocumentClient.from(ddbClient);
    this.tableName = tableName;
  }

  /**
   * Get existing delivery/shipment record for an order
   * Uses GSI to query by orderId
   */
  async getDelivery(orderId: string): Promise<ShipmentRecord | null> {
    try {
      // Query using OrderIdIndex GSI (from table-tennis-stack.ts)
      const result = await this.client.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: 'OrderIdIndex',
          KeyConditionExpression: 'orderId = :orderId',
          ExpressionAttributeValues: {
            ':orderId': orderId,
          },
          Limit: 1,
        })
      );

      if (result.Items && result.Items.length > 0) {
        console.log(`[dynamo-adapter] Found existing shipment for order ${orderId}`);
        return result.Items[0] as ShipmentRecord;
      }

      return null;
    } catch (err: any) {
      console.error(`[dynamo-adapter] getDelivery error for ${orderId}:`, err.message);
      throw err;
    }
  }

  /**
   * Atomic reservation: create a shipment record only if it doesn't exist
   * Uses conditional Put to prevent race conditions
   * Returns true if created, false if already exists
   */
  async createIfNotExists(orderId: string, payload: Partial<ShipmentRecord>): Promise<boolean> {
    const now = new Date().toISOString();
    const shipmentId = payload.shipmentId || `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const record: ShipmentRecord = {
      shipmentId,
      orderId,
      customerId: payload.customerId || '',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      shiprocketResponse: payload.shiprocketResponse || null,
      pickupResponse: payload.pickupResponse || null,
    };

    try {
      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: record,
          // Conditional: only write if shipmentId doesn't exist
          ConditionExpression: 'attribute_not_exists(shipmentId)',
        })
      );

      console.log(`[dynamo-adapter] Created shipment record ${shipmentId} for order ${orderId}`);
      return true;
    } catch (err: any) {
      // ConditionalCheckFailedException means record already exists
      if (err.name === 'ConditionalCheckFailedException') {
        console.log(`[dynamo-adapter] Shipment already exists for order ${orderId}, skipping duplicate`);
        return false;
      }
      console.error(`[dynamo-adapter] createIfNotExists error for ${orderId}:`, err.message);
      throw err;
    }
  }

  /**
   * Save/update delivery record after shipment + pickup complete
   */
  async saveDelivery(orderId: string, payload: any): Promise<void> {
    try {
      // First, get existing record to preserve shipmentId
      const existing = await this.getDelivery(orderId);
      if (!existing) {
        // No existing record, create new one
        await this.createIfNotExists(orderId, payload);
        return;
      }

      const now = new Date().toISOString();

      // Extract Shiprocket data from payload
      const shiprocketData = payload?.shiprocket || payload?.raw?.shiprocket;
      const pickupData = payload?.pickup || payload?.raw?.pickup;

      const updateRecord: Partial<ShipmentRecord> = {
        updatedAt: now,
        status: payload?.ok ? 'pickup_scheduled' : 'failed',
        shiprocketResponse: shiprocketData,
        pickupResponse: pickupData,
        error: payload?.error || null,
      };

      // Extract AWB and tracking info if available
      if (shiprocketData) {
        updateRecord.shiprocketOrderId = shiprocketData?.data?.shipment_id || shiprocketData?.shipment_id;
        updateRecord.trackingNumber = shiprocketData?.data?.awb_code || shiprocketData?.awb_code;
        updateRecord.courierName = shiprocketData?.data?.courier_name || shiprocketData?.courier_name;
      }

      // Update existing record
      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: {
            ...existing,
            ...updateRecord,
          },
        })
      );

      console.log(`[dynamo-adapter] Updated shipment ${existing.shipmentId} for order ${orderId}, status: ${updateRecord.status}`);
    } catch (err: any) {
      console.error(`[dynamo-adapter] saveDelivery error for ${orderId}:`, err.message);
      throw err;
    }
  }
}

/**
 * Factory function to create adapter instance
 */
export function createDynamoAdapter(tableName = 'table-tennis-shipments', region?: string): DynamoStorageAdapter {
  return new DynamoStorageAdapter(tableName, region);
}

export default { DynamoStorageAdapter, createDynamoAdapter };
