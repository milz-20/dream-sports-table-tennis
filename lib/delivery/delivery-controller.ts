import { processShipment } from './shiprocket-service';
import { createJiraTicket } from '../jira/jira-stub';

/**
 * DeliveryController
 * - Exposes a single function `runDelivery` which is a plug-n-play wrapper around processShipment
 * - Accepts an `order` (your app's order object) and `options` to control behaviour
 * - Returns a normalized delivery result including shipment and pickup details and any errors
 *
 * Options:
 * - notifyPhone?: string - phone to send notifications to (optional)
 * - storage?: { saveDelivery?: (orderId: string, payload: any) => Promise<void>, getDelivery?: (orderId: string) => Promise<any> }
 *
 * The module uses a small in-memory map to avoid duplicate processing in the same process (idempotency)
 * For production, pass a persistent `storage` adapter (DynamoDB / RDS) via options.storage
 */

type StorageAdapter = {
  saveDelivery?: (orderId: string, payload: any) => Promise<void>;
  getDelivery?: (orderId: string) => Promise<any>;
  // optional atomic reservation: create a record only if not exists
  createIfNotExists?: (orderId: string, payload: any) => Promise<boolean>;
};

const inMemoryProcessed = new Map<string, any>();

export async function runDelivery(
  order: any,
  options: { notifyPhone?: string; storage?: StorageAdapter } = {}
): Promise<any> {
  if (!order) throw new Error('order is required');

  const orderId = order.id ?? order.order_id ?? `ORDER-${Date.now()}`;

  // 1) Check persistent storage first (if provided)
  if (options.storage?.getDelivery) {
    try {
      const existing = await options.storage.getDelivery(orderId);
      if (existing) {
        return { ok: true, fromCache: true, order_id: orderId, ...existing };
      }
    } catch (e) {
      // ignore storage read errors but log
      console.warn('runDelivery: storage.getDelivery failed', e instanceof Error ? e.message : e);
    }
  }

  // 2) Try to reserve an execution slot atomically using createIfNotExists (strongly recommended)
  if (options.storage?.createIfNotExists) {
    try {
      const reserved = await options.storage.createIfNotExists(orderId, { status: 'started' });
      if (!reserved) {
        // Another process reserved/created it between the get and this call — read back the record and return it
        try {
          const existing = options.storage.getDelivery ? await options.storage.getDelivery(orderId) : null;
          if (existing) return { ok: true, fromCache: true, order_id: orderId, ...existing };
        } catch (e) {
          console.warn('runDelivery: read-after-reserve failed', e instanceof Error ? e.message : e);
        }
        // If still not found, fall through to attempt processing (rare)
      }
    } catch (e: any) {
      console.error('runDelivery: storage.createIfNotExists failed', e instanceof Error ? e.message : e);
      // create a JIRA ticket stub so ops can investigate race/error conditions
      await createJiraTicket(orderId, 'storage.createIfNotExists failure', { err: (e as any)?.message ?? String(e) });
      return { ok: false, order_id: orderId, error: 'reservation_failed' };
    }
  }

  // 3) In-process idempotency guard (best-effort; not reliable across processes)
  if (inMemoryProcessed.has(orderId)) {
    return { ok: true, fromCache: true, order_id: orderId, ...inMemoryProcessed.get(orderId) };
  }

  // 4) Call the existing processShipment which handles mapping, calling shiprocket-client, and notifications
  let shipResult: any = null;
  try {
    shipResult = await processShipment(order, { notifyPhone: options.notifyPhone });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    const payload = {
      ok: false,
      order_id: orderId,
      error: message,
    };
    // store failure result if storage adapter available
    try {
      if (options.storage?.saveDelivery) await options.storage.saveDelivery(orderId, payload);
    } catch (e) {
      console.warn('runDelivery: storage.saveDelivery failed', e instanceof Error ? e.message : e);
    }
    // create a JIRA ticket stub for operator investigation
    await createJiraTicket(orderId, 'processShipment failed', { error: message });
    return payload;
  }

  // Normalize response: processShipment returns { ok: true, shiprocket, pickup }
  const normalized = {
    ok: true,
    order_id: orderId,
    shiprocket: shipResult?.shiprocket ?? null,
    pickup: shipResult?.pickup ?? null,
    raw: shipResult,
  };

  // Save to in-memory cache and persistent storage if provided
  inMemoryProcessed.set(orderId, normalized);
  if (options.storage?.saveDelivery) {
    try {
      await options.storage.saveDelivery(orderId, normalized);
    } catch (e) {
      console.warn('runDelivery: storage.saveDelivery failed', e instanceof Error ? e.message : e);
    }
  }

  return normalized;
}

export default { runDelivery };
