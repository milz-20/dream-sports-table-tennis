import { runDelivery } from './delivery-controller';

/**
 * One-click smoke test for delivery flow.
 *
 * Usage (example):
 *  SHIPROCKET_DRY_RUN=false USE_AWS_SECRETS=true SHIPROCKET_SECRET_NAME=shipRocket-delivery-credentials AWS_REGION=ap-south-1 npm run delivery:smoke
 */

async function main() {
  // Minimal mock order — adjust fields to match your real order shape if needed
  const order = {
    id: `SMOKE-${Date.now()}`,
    date: new Date().toISOString(),
    customer: { firstName: 'Smoke', lastName: 'Test', email: 'smoke@test.local', phone: process.env.SMOKE_NOTIFY_PHONE ?? '9999999999' },
    shippingAddress: { line1: '1 Test Lane', city: 'TestCity', pincode: '400001', state: 'TestState', country: 'India' },
    paymentMethod: 'Prepaid',
    items: [{ id: 'item-smoke-1', name: 'Smoke Racket', quantity: 1, price: 1 }],
    subTotal: 1,
    weight: 0.5,
  };

  console.log('Running delivery smoke test. dryRun=', process.env.SHIPROCKET_DRY_RUN ?? 'undefined');

  try {
    const res = await runDelivery(order, { notifyPhone: order.customer.phone });
    console.log('SMOKE RESULT:', JSON.stringify(res, null, 2));
    if (!res || !res.ok) {
      console.error('Smoke test failed');
      process.exit(1);
    }
    console.log('Smoke test succeeded');
    process.exit(0);
  } catch (err: any) {
    console.error('Smoke test error', err instanceof Error ? err.stack ?? err.message : String(err));
    process.exit(2);
  }
}

main();
