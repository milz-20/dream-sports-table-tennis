import client from "./shiprocket-client";
import whatsapp from "./whatsapp-notifier";

/**
 * processShipment - orchestrates shipment creation and notifications.
 * - order: an object representing the completed order (shape from your app)
 * - options: { notifyPhone?: string }
 *
 * Behavior:
 * - Maps the incoming order into a Shiprocket-friendly payload
 * - Calls shiprocket-client.createShipment(payload)
 * - Sends an initial WhatsApp notification (stub) with the shipment status
 * - Runs in DRY_RUN mode by default (controlled via SHIPROCKET_DRY_RUN)
 */
export async function processShipment(order: any, options: { notifyPhone?: string } = {}) {
	if (!order) throw new Error("order is required");

	// Simple mapping - adjust to your real order fields
	const payload = {
		order_id: order.id ?? `ORDER-${Date.now()}`,
		order_date: order.date ?? new Date().toISOString(),
		pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION ?? "Default Pickup",
		channel_id: process.env.SHIPROCKET_CHANNEL_ID ? Number(process.env.SHIPROCKET_CHANNEL_ID) : 1,
		billing_customer_name: `${order.customer?.firstName ?? order.customerName ?? "Customer"}`,
		billing_last_name: order.customer?.lastName ?? "",
		billing_address: order.shippingAddress?.line1 ?? order.address ?? "",
		billing_city: order.shippingAddress?.city ?? order.city ?? "",
		billing_pincode: order.shippingAddress?.pincode ?? order.pincode ?? "",
		billing_state: order.shippingAddress?.state ?? order.state ?? "",
		billing_country: order.shippingAddress?.country ?? order.country ?? "India",
		billing_email: order.customer?.email ?? order.email ?? "",
		billing_phone: order.customer?.phone ?? order.phone ?? process.env.DEFAULT_PHONE ?? "",
		shipping_is_billing: true,
		payment_method: order.paymentMethod ?? (order.isPaid ? "Prepaid" : "COD"),
		sub_total: order.subTotal ?? order.total ?? 0,
		length: order.dimensions?.length ?? 10,
		breadth: order.dimensions?.breadth ?? 5,
		height: order.dimensions?.height ?? 5,
		weight: order.weight ?? 0.5,
		order_items: (order.items ?? []).map((it: any) => ({
			name: it.name,
			sku: it.sku ?? it.id,
			units: it.quantity ?? it.qty ?? 1,
			selling_price: it.price ?? it.selling_price ?? 0,
		})),
	};

	// Call Shiprocket client
	let shipRes: any;
	try {
		shipRes = await client.createShipment(payload);
	} catch (err) {
		// notify failure via whatsapp stub
		const msg = `Shipment creation failed for order ${payload.order_id}: ${err instanceof Error ? err.message : String(err)}`;
		await whatsapp.notify(options.notifyPhone ?? payload.billing_phone, msg);
		throw err;
	}

	// Send a notification with shipment result
	const successMsg = shipRes && shipRes.dryRun
		? `Shipment for order ${payload.order_id} prepared (dry-run).`
		: `Shipment created for order ${payload.order_id}. Response: ${JSON.stringify(shipRes)}`;

	await whatsapp.notify(options.notifyPhone ?? payload.billing_phone, successMsg);

	return {
		ok: true,
		shiprocket: shipRes,
	};
}

export default { processShipment };
