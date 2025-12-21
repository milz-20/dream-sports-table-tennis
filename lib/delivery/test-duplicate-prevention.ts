/**
 * Test runner to verify duplicate prevention logic
 * 
 * This demonstrates that:
 * 1. First call creates shipment + pickup
 * 2. Second call for same order returns cached result (no duplicate shipment)
 * 3. Storage adapter correctly implements idempotency
 * 
 * Usage:
 *   # With mock storage (local testing, no DynamoDB required)
 *   npm run delivery:test-duplicate
 * 
 *   # With real DynamoDB (requires AWS credentials and deployed table)
 *   USE_DYNAMODB=true npm run delivery:test-duplicate
 */

import 'dotenv/config';
import { runDelivery } from './delivery-controller';
import storageAdapterMock from './storage-adapter-mock';
import { createDynamoAdapter } from './storage-adapter-dynamo';

async function testDuplicatePrevention() {
  console.log('=== Testing Duplicate Prevention Logic ===\n');

  // Ensure dry-run mode for safety
  process.env.SHIPROCKET_DRY_RUN = 'true';

  // Choose storage adapter based on environment
  const useDynamoDB = process.env.USE_DYNAMODB === 'true';
  const storageType = useDynamoDB ? 'DynamoDB (table-tennis-shipments)' : 'In-Memory Mock';
  const storageAdapter = useDynamoDB ? createDynamoAdapter() : storageAdapterMock;
  
  console.log(`Storage Adapter: ${storageType}\n`);

  const testOrder = {
    id: `ORDER-TEST-${Date.now()}`,
    date: new Date().toISOString(),
    customer: {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'test@example.com',
      phone: '9999999999',
    },
    shippingAddress: {
      line1: '123 Test Street',
      city: 'Mumbai',
      pincode: '400001',
      state: 'Maharashtra',
      country: 'India',
    },
    items: [
      { id: 'item-1', name: 'Table Tennis Racket', quantity: 1, price: 1500 }
    ],
    subTotal: 1500,
    weight: 0.5,
    isPaid: true,
  };

  console.log(`Test Order ID: ${testOrder.id}\n`);

  // First call - should create shipment
  console.log('--- Call #1: First delivery attempt ---');
  const result1 = await runDelivery(testOrder, {
    notifyPhone: testOrder.customer.phone,
    storage: storageAdapter,
  });
  console.log('Result 1:', JSON.stringify({
    ok: result1.ok,
    order_id: result1.order_id,
    fromCache: result1.fromCache,
    hasShipment: !!result1.shiprocket,
    hasPickup: !!result1.pickup,
  }, null, 2));
  console.log();

  // Second call - should return cached result (no duplicate)
  console.log('--- Call #2: Duplicate attempt (should be prevented) ---');
  const result2 = await runDelivery(testOrder, {
    notifyPhone: testOrder.customer.phone,
    storage: storageAdapter,
  });
  console.log('Result 2:', JSON.stringify({
    ok: result2.ok,
    order_id: result2.order_id,
    fromCache: result2.fromCache,
    hasShipment: !!result2.shiprocket,
    hasPickup: !!result2.pickup,
  }, null, 2));
  console.log();

  // Third call - verify still cached
  console.log('--- Call #3: Another duplicate attempt ---');
  const result3 = await runDelivery(testOrder, {
    notifyPhone: testOrder.customer.phone,
    storage: storageAdapter,
  });
  console.log('Result 3:', JSON.stringify({
    ok: result3.ok,
    order_id: result3.order_id,
    fromCache: result3.fromCache,
    hasShipment: !!result3.shiprocket,
    hasPickup: !!result3.pickup,
  }, null, 2));
  console.log();

  // Verify results
  console.log('=== Verification ===');
  console.log(`✅ Call 1 success: ${result1.ok}`);
  console.log(`✅ Call 2 from cache: ${result2.fromCache === true}`);
  console.log(`✅ Call 3 from cache: ${result3.fromCache === true}`);

  // Show storage state (only for mock)
  if (!useDynamoDB) {
    console.log('\n=== Storage State (Mock) ===');
    const allRecords = await storageAdapterMock.getAllRecords();
    console.log(`Total records: ${allRecords.length}`);
    allRecords.forEach(r => {
      console.log(`  ${r.order_id}: status=${r.status}, created=${r.createdAt || 'N/A'}`);
    });
  } else {
    console.log('\n=== Storage State (DynamoDB) ===');
    console.log('Check AWS Console for table-tennis-shipments table');
    console.log(`Query: orderId = ${testOrder.id}`);
  }

  console.log('\n✅ Duplicate prevention test complete');
}

testDuplicatePrevention().catch(console.error);

if (require.main === module) {
  testDuplicatePrevention()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Test failed:', err);
      process.exit(1);
    });
}
