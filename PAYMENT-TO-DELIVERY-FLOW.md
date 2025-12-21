# Payment to Delivery Integration - Complete Flow

## 📊 Architecture Overview

```
Customer Checkout → Razorpay Payment → Webhook → Order Confirmation → Shipment Creation → WhatsApp Notification
```

## 🔄 Detailed Flow

### 1. Order Creation (Lambda: create-order.ts)

**Trigger**: POST /payment/create-order

**Process**:
1. Customer completes checkout in frontend
2. Frontend sends cart items + customer details to create-order Lambda
3. Lambda creates Razorpay order
4. Lambda saves to DynamoDB:
   - Orders table (status: 'pending', paymentStatus: 'pending')
   - Payments table (status: 'pending')
   - Addresses table (shipping address)
5. Returns Razorpay order_id to frontend
6. Frontend opens Razorpay checkout modal

**Tables Written**:
- `table-tennis-orders` (PK: orderId, SK: createdAt)
- `table-tennis-payments` (PK: paymentId, SK: orderId)
- `table-tennis-addresses` (PK: addressId, SK: ownerId)

---

### 2. Payment Completion (Razorpay)

**Trigger**: Customer completes payment in Razorpay modal

**Process**:
1. Customer enters payment details (UPI/Card/NetBanking)
2. Razorpay processes payment
3. On success: Razorpay triggers webhook to our API
4. On failure: Razorpay triggers webhook with failure status

---

### 3. Webhook Processing (Lambda: verify-payment.ts)

**Trigger**: POST /payment/webhook (from Razorpay)

**Event**: `payment.captured`

**Process**:
```typescript
// Step 1: Verify webhook signature
const isValid = verifyWebhookSignature(body, signature, secret);

// Step 2: Update Payment record
await updatePaymentRecord(razorpayOrderId, paymentMethod, 'completed');

// Step 3: Update Order status
await updateOrderStatus(orderId, createdAt, 'confirmed', 'paid');

// Step 4: Update Product stock and Seller sales
await updateProductStockAndSellerSales(orderItems);

// Step 5: 🚀 CREATE SHIPMENT (NEW)
const orderData = await getOrderWithDetails(orderId, createdAt);
const shipmentResult = await runDelivery(orderData, {
  notifyPhone: orderData.customer.phone,
  storage: createDynamoAdapter(),
});

// Step 6: Update Order with shipment details
await updateOrderWithShipmentDetails(orderId, shipmentResult);

// Step 7: Send WhatsApp notification (via whatsapp-notifier)
await sendOrderConfirmation(orderData, shipmentResult);
```

**Tables Updated**:
- `table-tennis-payments`: status='completed', method='upi/card/etc'
- `table-tennis-orders`: status='confirmed', paymentStatus='paid', shipmentId, awb, shipmentStatus='pending_pickup'
- `table-tennis-products`: stock decremented
- `table-tennis-sellers`: totalSales incremented
- `table-tennis-shipments`: NEW shipment record created

---

### 4. Shipment Creation (runDelivery)

**Location**: `lambda/delivery/delivery-controller.ts`

**Process**:
```typescript
// 1. Check if shipment already exists (idempotency)
const existing = await storage.getDelivery(orderId);
if (existing) {
  return { ...existing, fromCache: true };
}

// 2. Atomic reservation (prevent duplicates)
const reserved = await storage.createIfNotExists(orderId, 'pending');
if (!reserved) {
  // Another process already creating shipment
  await createJiraTicket(orderId, 'Duplicate shipment attempt');
  return { ok: false, error: 'Already processing' };
}

// 3. Create shipment in Shiprocket
const shipmentResult = await createShipment(orderData);

// 4. Schedule pickup
const pickupResult = await createPickup(shipmentData);

// 5. Save to DynamoDB
await storage.saveDelivery(orderId, {
  shipment_id: shipmentResult.shipment_id,
  awb_code: shipmentResult.awb_code,
  pickup_scheduled: pickupResult.pickup_scheduled_date,
  status: 'completed',
});

return { ok: true, shiprocket: shipmentResult, pickup: pickupResult };
```

**Shiprocket API Calls**:
1. `POST /auth/login` - Get auth token
2. `POST /shipments` - Create shipment
3. `POST /courier/generate/shipments` - Schedule pickup

**DynamoDB Operations**:
- Query `table-tennis-shipments` (OrderIdIndex) - Check existing
- PutItem `table-tennis-shipments` (conditional write) - Atomic reservation
- UpdateItem `table-tennis-shipments` - Save final result

---

### 5. WhatsApp Notification

**Location**: `lambda/delivery/whatsapp-notifier.ts`

**Process**:
```typescript
// Send order confirmation
await sendWhatsAppMessage({
  to: customerPhone,
  template: 'order_confirmation',
  params: {
    orderNumber: orderId,
    orderAmount: totalAmount,
    estimatedDelivery: '3-5 business days',
    trackingUrl: `https://yourdomain.com/track/${awb}`,
  },
});

// Send shipment tracking details
await sendWhatsAppMessage({
  to: customerPhone,
  template: 'shipment_created',
  params: {
    orderNumber: orderId,
    awb: awbCode,
    courierName: 'Blue Dart/DTDC',
    trackingLink: `https://shiprocket.co/tracking/${awb}`,
  },
});
```

**TODO**: Replace stub with real WhatsApp API integration (MSG91/Twilio/WATI)

---

## 🗃️ Database Schema

### Orders Table
```typescript
{
  orderId: string,         // PK
  createdAt: string,       // SK (ISO timestamp)
  customerId: string,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'failed',
  totalAmount: number,
  orderItems: Array<{
    productId: string,
    name: string,
    quantity: number,
    price: number,
  }>,
  shippingAddressId: string,
  // NEW FIELDS for shipment tracking
  shipmentId?: string,     // Shiprocket shipment ID
  awb?: string,           // Air Waybill number (tracking number)
  shipmentStatus?: 'pending_pickup' | 'picked_up' | 'in_transit' | 'delivered',
  shipmentCreatedAt?: string,
}
```

### Shipments Table
```typescript
{
  shipmentId: string,      // PK (UUID)
  orderId: string,         // SK
  customerId: string,
  shiprocketOrderId: string,
  trackingNumber: string,  // AWB code
  status: 'pending' | 'pickup_scheduled' | 'in_transit' | 'delivered',
  courierName: string,
  courierAWB: string,
  pickupScheduledDate: string,
  deliveryExpectedDate: string,
  createdAt: string,
  updatedAt: string,
}
```

**GSI**: OrderIdIndex (query by orderId)

---

## 🔧 Environment Variables

### Webhook Lambda (verify-payment)

```bash
# Razorpay
RAZORPAY_SECRET_NAME=test_secret

# DynamoDB Tables
ORDERS_TABLE_NAME=table-tennis-orders
PAYMENTS_TABLE_NAME=table-tennis-payments
PRODUCTS_TABLE_NAME=table-tennis-products
SELLERS_TABLE_NAME=table-tennis-sellers
CUSTOMERS_TABLE_NAME=table-tennis-customers
ADDRESSES_TABLE_NAME=table-tennis-addresses
SHIPMENTS_TABLE_NAME=table-tennis-shipments

# Shiprocket
USE_AWS_SECRETS=true
SHIPROCKET_SECRET_NAME=shipRocket-delivery-credentials
SHIPROCKET_DRY_RUN=true  # Set to 'false' in production
SHIPROCKET_PICKUP_LOCATION=Default Pickup
SHIPROCKET_CHANNEL_ID=1
SHIPROCKET_PICKUP_TIME=10:00-18:00

# WhatsApp (TODO)
WHATSAPP_API_KEY=<your-key>
WHATSAPP_SENDER_ID=<your-sender-id>
```

---

## 🔐 IAM Permissions

### Webhook Lambda Permissions

**Secrets Manager**:
- `secretsmanager:GetSecretValue` on:
  - `test_secret-*` (Razorpay credentials)
  - `shipRocket-delivery-credentials-*` (Shiprocket credentials)

**DynamoDB**:
- `dynamodb:GetItem`, `dynamodb:PutItem`, `dynamodb:UpdateItem`, `dynamodb:Query` on:
  - `table-tennis-orders`
  - `table-tennis-payments`
  - `table-tennis-products`
  - `table-tennis-sellers`
  - `table-tennis-customers` (read only)
  - `table-tennis-addresses` (read only)
  - `table-tennis-shipments`
  - `table-tennis-shipments/index/OrderIdIndex` (GSI)

---

## 🧪 Testing Flow

### Local Testing

```bash
# 1. Start with create-order Lambda test
cd lambda
npm run build

# 2. Test order creation (simulates frontend checkout)
aws lambda invoke \
  --function-name CreateOrderFunction \
  --payload '{"body": "{\"amount\":1500,\"notes\":{\"customerId\":\"cst_123\",\"items\":\"[{\\\"id\\\":\\\"prod_1\\\",\\\"name\\\":\\\"Racket\\\",\\\"quantity\\\":1,\\\"price\\\":1500}]\"}}" }' \
  response.json

# 3. Get orderId from response
cat response.json

# 4. Simulate webhook (payment.captured event)
aws lambda invoke \
  --function-name PaymentWebhookFunction \
  --payload file://test-webhook-payload.json \
  webhook-response.json

# 5. Check DynamoDB for shipment record
aws dynamodb query \
  --table-name table-tennis-shipments \
  --index-name OrderIdIndex \
  --key-condition-expression "orderId = :oid" \
  --expression-attribute-values '{":oid":{"S":"ORDER-123"}}'

# 6. Check Jira logs for any failures
cat lib/delivery/delivery_jira_log.jsonl | jq '.'
```

### End-to-End Testing

```bash
# 1. Run complete flow test
npm run test:e2e

# 2. Verify:
# - Order status = 'confirmed'
# - Payment status = 'paid'
# - Shipment record exists
# - Order has shipmentId and awb
# - WhatsApp message sent (check logs)
# - No Jira tickets created (no errors)
```

---

## 🚨 Error Handling & Jira Tickets

### Ticket Categories

1. **Delivery Failures** (`category: 'delivery'`)
   - Shipment creation failed
   - Pickup scheduling failed
   - Duplicate prevention triggered
   - AWB not received

2. **Payment Failures** (`category: 'payment'`)
   - Webhook signature invalid
   - Payment record update failed
   - Razorpay API error

3. **Stock Failures** (`category: 'stock'`)
   - Product stock update failed
   - Seller sales increment failed
   - Product not found

4. **Database Failures** (`category: 'database'`)
   - DynamoDB query/put/update failed
   - Record not found

### Ticket Structure

```json
{
  "id": "JIRA-1703158431203-abc123",
  "orderId": "ORDER-123",
  "category": "delivery",
  "severity": "high",
  "issue": "Shipment creation failed",
  "errorMessage": "Shiprocket API timeout",
  "errorStack": "Error: timeout of 30000ms exceeded...",
  "context": {
    "orderId": "ORDER-123",
    "customerId": "cst_123",
    "paymentId": "pay_abc",
    "razorpayOrderId": "order_xyz",
    "amount": 1500,
    "customerEmail": "customer@example.com",
    "customerPhone": "9999999999",
    "deliveryStage": "shipment_creation"
  },
  "createdAt": "2025-12-21T12:00:00.000Z",
  "environment": "production"
}
```

### Viewing Jira Logs

```bash
# All tickets
cat lib/delivery/delivery_jira_log.jsonl

# Delivery failures only
cat lib/delivery/delivery_jira_log.jsonl | jq 'select(.category=="delivery")'

# Critical severity
cat lib/delivery/delivery_jira_log.jsonl | jq 'select(.severity=="critical")'

# Specific order
cat lib/delivery/delivery_jira_log.jsonl | jq 'select(.orderId=="ORDER-123")'
```

---

## 📋 Pre-Deployment Checklist

- [ ] **Secrets Manager**
  - [ ] Create/update `test_secret` with Razorpay credentials
  - [ ] Create/update `shipRocket-delivery-credentials`
  
- [ ] **Environment Variables**
  - [ ] Set `SHIPROCKET_DRY_RUN=false` for production
  - [ ] Configure `SHIPROCKET_PICKUP_LOCATION`
  - [ ] Set `SHIPROCKET_CHANNEL_ID` (from Shiprocket dashboard)
  
- [ ] **DynamoDB**
  - [ ] Verify all tables exist and are active
  - [ ] Verify `OrderIdIndex` GSI on shipments table
  
- [ ] **Lambda**
  - [ ] Build Lambda functions: `cd lambda && npm run build`
  - [ ] Verify dist folder has all compiled files
  - [ ] Test locally with sample payloads
  
- [ ] **IAM**
  - [ ] All secrets manager permissions granted
  - [ ] All DynamoDB table permissions granted
  - [ ] Lambda execution role has necessary permissions
  
- [ ] **Monitoring**
  - [ ] CloudWatch log groups created
  - [ ] Alarms set for Lambda errors
  - [ ] Alarms set for Jira critical tickets
  
- [ ] **WhatsApp Integration** (TODO)
  - [ ] Replace whatsapp-notifier stub with real API
  - [ ] Test message templates
  - [ ] Verify message delivery

---

## 🎯 Success Metrics

**Webhook Processing**:
- ✅ Webhook signature verified
- ✅ Payment record updated to 'completed'
- ✅ Order status updated to 'confirmed'
- ✅ Product stock decremented
- ✅ Shipment created in Shiprocket (or dry-run logged)
- ✅ Shipment record saved to DynamoDB
- ✅ Order updated with shipmentId and awb
- ✅ WhatsApp notification sent
- ✅ No Jira tickets created (no errors)

**Response Time**:
- Webhook processing: < 5 seconds
- Shipment creation: < 3 seconds
- Total webhook duration: < 60 seconds (Lambda timeout)

**Error Rate**:
- < 1% shipment creation failures
- 0% duplicate shipments
- 100% Jira ticket creation for failures

---

## 🔄 Next Steps

1. **Complete WhatsApp Integration**
   - Choose provider (MSG91/Twilio/WATI)
   - Create message templates
   - Replace `whatsapp-notifier.ts` stub

2. **Add Shipment Tracking**
   - Create GET /api/orders/:id/tracking endpoint
   - Build frontend tracking UI
   - Poll Shiprocket for status updates

3. **Webhook for Shiprocket Events**
   - Configure Shiprocket webhook URL
   - Handle status updates (picked_up, in_transit, delivered)
   - Update order and shipment status in real-time

4. **Monitoring & Alerts**
   - CloudWatch dashboard for metrics
   - SNS alerts for critical failures
   - Automated Jira ticket creation (real API)

5. **Testing**
   - End-to-end integration tests
   - Load testing with concurrent orders
   - Failure scenario testing
