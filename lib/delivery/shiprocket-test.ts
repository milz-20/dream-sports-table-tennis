import "dotenv/config";
import { processShipment } from "./shiprocket-service";

async function main() {
  console.log("Starting Shiprocket test (dry-run by default)");

  // Example order/shipment payload - adapt fields to your app's order shape
  const sampleShipment = {
    order_id: `ORDER-${Date.now()}`,
    order_date: new Date().toISOString(),
    pickup_location: "Default Pickup",
    channel_id: 1,
    billing_customer_name: "Test Customer",
    billing_last_name: "",
    billing_address: "123 Test St",
    billing_city: "Test City",
    billing_pincode: "123456",
    billing_state: "Test State",
    billing_country: "India",
    billing_email: "test@example.com",
    billing_phone: "9999999999",
    shipping_is_billing: true,
    payment_method: "Prepaid",
    sub_total: 100,
    length: 10,
    breadth: 5,
    height: 5,
    weight: 0.5,
    order_items: [
      {
        name: "Table Tennis Racket",
        sku: "RKT-001",
        units: 1,
        selling_price: 100,
      },
    ],
  };

  try {
    const res = await processShipment(
      {
        id: sampleShipment.order_id,
        date: sampleShipment.order_date,
        customer: { firstName: sampleShipment.billing_customer_name, email: sampleShipment.billing_email, phone: sampleShipment.billing_phone },
        shippingAddress: { line1: sampleShipment.billing_address, city: sampleShipment.billing_city, pincode: sampleShipment.billing_pincode, state: sampleShipment.billing_state, country: sampleShipment.billing_country },
        items: sampleShipment.order_items,
        subTotal: sampleShipment.sub_total,
        isPaid: true,
      },
      { notifyPhone: sampleShipment.billing_phone }
    );
    console.log("Shiprocket test result:", res);
  } catch (err) {
    console.error("Shiprocket test failed:", err instanceof Error ? err.message : err);
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
