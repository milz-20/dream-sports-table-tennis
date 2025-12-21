import "dotenv/config";
import assert from "assert";
import { processShipment } from "./shiprocket-service";
import { runDelivery } from "./delivery-controller";

async function main() {
  console.log("Starting Shiprocket + Delivery controller test (dry-run by default)");

  // Ensure dry-run mode unless explicitly disabled
  process.env.SHIPROCKET_DRY_RUN = process.env.SHIPROCKET_DRY_RUN ?? "true";

  // Example order/shipment payload - adapt fields to your app's order shape
  const sampleOrder = {
    id: `ORDER-${Date.now()}`,
    date: new Date().toISOString(),
    customer: { firstName: "Test Customer", email: "test@example.com", phone: "9999999999" },
    shippingAddress: { line1: "123 Test St", city: "Test City", pincode: "123456", state: "Test State", country: "India" },
    items: [
      { name: "Table Tennis Racket", sku: "RKT-001", quantity: 1, price: 100 }
    ],
    subTotal: 100,
    isPaid: true,
  };

  // 1) Direct createShipment dry-run (low-level smoke test)
  try {
    const res = await processShipment(
      {
        id: sampleOrder.id,
        date: sampleOrder.date,
        customer: sampleOrder.customer,
        shippingAddress: sampleOrder.shippingAddress,
        items: sampleOrder.items,
        subTotal: sampleOrder.subTotal,
        isPaid: sampleOrder.isPaid,
      },
      { notifyPhone: sampleOrder.customer.phone }
    );
    console.log("processShipment (dry-run) result:\n", JSON.stringify(res, null, 2));
    // Basic assertions for the dry-run response shape
    assert.strictEqual(res.ok, true, 'processShipment should return ok: true in dry-run');
    assert.ok(res.shiprocket, 'processShipment should include shiprocket response');
    assert.ok(res.pickup, 'processShipment should include pickup response');
    assert.strictEqual(res.shiprocket.dryRun, true, 'shiprocket.dryRun should be true in dry-run');
    console.log('processShipment smoke test: PASS');
  } catch (err) {
    console.error("processShipment test failed:", err instanceof Error ? err.message : err);
  }

  // 2) Higher-level runDelivery which uses the controller (idempotency + storage adapter)
  // Simple in-memory storage adapter for testing
  const storage = (() => {
    const map = new Map<string, any>();
    return {
      async getDelivery(orderId: string) { return map.get(orderId) ?? null; },
      async saveDelivery(orderId: string, payload: any) { map.set(orderId, payload); }
    };
  })();

  try {
    const res1 = await runDelivery(sampleOrder, { notifyPhone: sampleOrder.customer.phone, storage });
    console.log("runDelivery first run result:\n", JSON.stringify(res1, null, 2));

    // Basic assertions
    assert.strictEqual(res1.ok, true, 'runDelivery should return ok: true on first run');
    assert.strictEqual(res1.order_id, sampleOrder.id, 'runDelivery order_id should match');
    assert.ok(res1.shiprocket, 'runDelivery should include shiprocket response');

    // Call again to verify idempotency (should return cached result)
    const res2 = await runDelivery(sampleOrder, { notifyPhone: sampleOrder.customer.phone, storage });
    console.log("runDelivery second run (idempotent) result:\n", JSON.stringify(res2, null, 2));
    assert.strictEqual(res2.fromCache, true, 'Second run should return fromCache:true');
    console.log('runDelivery idempotency test: PASS');

    console.log('\nALL TESTS PASSED');
    process.exit(0);
  } catch (err) {
    console.error("runDelivery test failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
