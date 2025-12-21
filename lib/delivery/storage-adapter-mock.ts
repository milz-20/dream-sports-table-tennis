/**
 * Mock Storage Adapter for Delivery Records
 * 
 * This is a temporary in-memory implementation that follows the storage adapter contract.
 * Replace this with real DynamoDB implementation later.
 * 
 * Contract methods:
 * - getDelivery(orderId): returns existing delivery record or null
 * - createIfNotExists(orderId, payload): atomic reservation (returns true if created, false if exists)
 * - saveDelivery(orderId, payload): saves/updates delivery record
 * 
 * Usage in main controller:
 * ```
 * import storageAdapter from './lib/delivery/storage-adapter-mock';
 * const result = await runDelivery(order, { storage: storageAdapter });
 * ```
 */

type DeliveryRecord = {
  order_id: string;
  status: 'started' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  shiprocket?: any;
  pickup?: any;
  raw?: any;
  error?: string;
};

// In-memory store (replace with DynamoDB later)
const store = new Map<string, DeliveryRecord>();

export const storageAdapterMock = {
  /**
   * Get existing delivery record for an order
   * Returns null if not found
   */
  async getDelivery(orderId: string): Promise<DeliveryRecord | null> {
    const record = store.get(orderId);
    if (record) {
      console.log(`[storage-mock] Found existing delivery for ${orderId}, status: ${record.status}`);
    }
    return record ?? null;
  },

  /**
   * Atomic reservation: create a record only if it doesn't exist
   * Returns true if created, false if already exists
   * 
   * In real DynamoDB, use conditional Put with attribute_not_exists(order_id)
   */
  async createIfNotExists(orderId: string, payload: Partial<DeliveryRecord>): Promise<boolean> {
    if (store.has(orderId)) {
      console.log(`[storage-mock] Order ${orderId} already exists, skipping duplicate call`);
      return false;
    }

    const now = new Date().toISOString();
    const record: DeliveryRecord = {
      order_id: orderId,
      status: payload.status ?? 'started',
      createdAt: payload.createdAt ?? now,
      updatedAt: now,
      raw: payload.raw ?? null,
    };

    store.set(orderId, record);
    console.log(`[storage-mock] Reserved delivery slot for ${orderId}`);
    return true;
  },

  /**
   * Save/update delivery record
   * Called after shipment + pickup complete (or on failure)
   */
  async saveDelivery(orderId: string, payload: any): Promise<void> {
    const now = new Date().toISOString();
    const existing = store.get(orderId);
    
    const record: DeliveryRecord = {
      order_id: orderId,
      status: payload?.ok ? 'completed' : (payload?.status ?? 'failed'),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      shiprocket: payload?.shiprocket ?? null,
      pickup: payload?.pickup ?? null,
      raw: payload?.raw ?? payload,
      error: payload?.error ?? null,
    };

    store.set(orderId, record);
    console.log(`[storage-mock] Saved delivery for ${orderId}, status: ${record.status}`);
  },

  /**
   * Utility: Get all records (for debugging/inspection)
   */
  async getAllRecords(): Promise<DeliveryRecord[]> {
    return Array.from(store.values());
  },

  /**
   * Utility: Clear all records (for testing)
   */
  async clearAll(): Promise<void> {
    store.clear();
    console.log('[storage-mock] Cleared all records');
  }
};

export default storageAdapterMock;
