# DynamoDB Tables Schema and Transaction Flow

## Database Architecture Overview

The table tennis e-commerce application uses 6 DynamoDB tables to manage the complete order lifecycle:

### 1. **table-tennis-customers**
**Purpose**: Store customer information
**Primary Key**:
- Partition Key: `customerId` (String)
- Sort Key: `email` (String)

**Global Secondary Indexes**:
- `PhoneIndex`: Query by phone number

**Attributes** (beyond keys):
- `name` - Customer full name
- `phone` - Customer phone number
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

---

### 2. **table-tennis-products**
**Purpose**: Store product catalog
**Primary Key**:
- Partition Key: `productId` (String)
- Sort Key: `sellerId` (String)

**Global Secondary Indexes**:
- `CategoryIndex`: Query by category and name
- `BrandIndex`: Query by brand and name

**Attributes** (beyond keys):
- `name` - Product name
- `category` - Product category (blades, rubbers, shoes, etc.)
- `brand` - Brand name (Butterfly, Stiga, etc.)
- `price` - Current price
- `originalPrice` - Original/MRP price
- `description` - Product description
- `image` - Product image URL
- `stock` - Available quantity
- `isActive` - Product availability status
- `createdAt` - Product listing timestamp
- `updatedAt` - Last update timestamp

---

### 3. **table-tennis-orders**
**Purpose**: Store order information (already exists)
**Primary Key**:
- Partition Key: `orderId` (String)
- Sort Key: `customerId` (String)

**Global Secondary Indexes** (from existing table):
- `CustomerOrdersIndex`: Query by customerId
- `StatusIndex`: Query by order status

**Attributes**:
- `status` - Order status (pending, confirmed, processing, shipped, delivered, cancelled)
- `items` - Array of order items with product details
- `totalAmount` - Total order amount
- `customerName` - Customer name
- `customerEmail` - Customer email
- `customerPhone` - Customer phone
- `shippingAddress` - Delivery address object
- `razorpayOrderId` - Razorpay order ID
- `razorpayPaymentId` - Razorpay payment ID
- `paymentStatus` - Payment status
- `createdAt` - Order creation timestamp
- `updatedAt` - Last update timestamp

---

### 4. **table-tennis-payments**
**Purpose**: Track payment transactions
**Primary Key**:
- Partition Key: `paymentId` (String) - Razorpay payment ID
- Sort Key: `orderId` (String)

**Global Secondary Indexes**:
- `RazorpayIndex`: Query by razorpayOrderId

**Attributes**:
- `razorpayOrderId` - Razorpay order ID
- `razorpayPaymentId` - Razorpay payment ID (same as partition key)
- `razorpaySignature` - Razorpay signature for verification
- `customerId` - Customer ID
- `amount` - Payment amount in paise
- `currency` - Currency (INR)
- `status` - Payment status (created, authorized, captured, failed, refunded)
- `method` - Payment method (card, upi, netbanking, wallet)
- `email` - Customer email
- `contact` - Customer phone
- `createdAt` - Payment initiation timestamp
- `capturedAt` - Payment capture timestamp
- `failureReason` - Reason for payment failure (if any)

---

### 5. **table-tennis-addresses**
**Purpose**: Store customer addresses
**Primary Key**:
- Partition Key: `addressId` (String)

**Attributes**:
- `customerId` - Customer ID (foreign key)
- `name` - Recipient name
- `phone` - Recipient phone
- `addressLine1` - Address line 1
- `addressLine2` - Address line 2
- `city` - City
- `state` - State
- `pincode` - PIN code
- `landmark` - Landmark
- `addressType` - Type (home, office, etc.)
- `isDefault` - Default address flag
- `createdAt` - Address creation timestamp
- `updatedAt` - Last update timestamp

---

### 6. **table-tennis-shipments**
**Purpose**: Track shipment information
**Primary Key**:
- Partition Key: `shipmentId` (String)
- Sort Key: `orderId` (String)

**Global Secondary Indexes**:
- `ShiprocketIndex`: Query by shiprocketOrderId
- `TrackingIndex`: Query by trackingNumber

**Attributes**:
- `orderId` - Order ID
- `shiprocketOrderId` - Shiprocket order ID
- `trackingNumber` - AWB/tracking number
- `courierName` - Courier company name
- `status` - Shipment status (pending, picked, in_transit, out_for_delivery, delivered)
- `estimatedDelivery` - Expected delivery date
- `actualDelivery` - Actual delivery timestamp
- `shippingAddress` - Delivery address object
- `createdAt` - Shipment creation timestamp
- `updatedAt` - Last update timestamp

---

## Complete Transaction Flow

### **Step 1: Customer Browses Products**
**Frontend**: User visits `/equipment` page
- **Action**: Frontend loads products from static `equipmentData.ts` (currently hardcoded)
- **Future Enhancement**: Create a Lambda function to query `table-tennis-products` table using `CategoryIndex` GSI

```typescript
// Future Lambda: get-products.ts
const params = {
  TableName: 'table-tennis-products',
  IndexName: 'CategoryIndex',
  KeyConditionExpression: 'category = :category',
  ExpressionAttributeValues: {
    ':category': 'blades'
  }
};
```

---

### **Step 2: Customer Adds Items to Cart**
**Frontend**: User clicks "Add to Cart"
- **Action**: Items stored in React Context (CartContext) and localStorage
- **No database interaction** - cart is client-side only until checkout

---

### **Step 3: Customer Proceeds to Checkout**
**Frontend**: User clicks "Proceed to Checkout" → navigates to `/checkout`
- **Action**: User fills in shipping details (name, email, phone, address)
- **No database interaction** yet - collecting information

---

### **Step 4: Payment Initiation**
**Frontend**: User clicks "Pay Now"

**Lambda: `create-order.ts`** (Already implemented)
```typescript
// 1. Receive request from frontend
const { amount, currency, receipt, notes } = body;

// 2. Retrieve Razorpay credentials from Secrets Manager
const secret = await secretsManager.getSecretValue({ SecretId: 'test_secret' });
const { 'api:key': key_id, 'api:secret': key_secret } = JSON.parse(secret.SecretString);

// 3. Create Razorpay order
const razorpay = new Razorpay({ key_id, key_secret });
const order = await razorpay.orders.create({
  amount: amount, // Amount in paise
  currency: currency,
  receipt: receipt,
  notes: notes
});

// 4. Return order details to frontend
return {
  success: true,
  order: {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt
  },
  key_id: key_id
};
```

**Data Written**: None yet
**API Endpoint**: `POST /payment/create-order`

---

### **Step 5: Razorpay Payment Modal**
**Frontend**: Razorpay checkout modal opens
- **Action**: User enters payment details (card/UPI/netbanking)
- **Razorpay Process**: User completes payment with Razorpay
- **Callback**: Razorpay returns payment response to frontend with:
  - `razorpay_order_id`
  - `razorpay_payment_id`
  - `razorpay_signature`

---

### **Step 6: Payment Success - Frontend Redirect**
**Frontend**: After successful payment
```typescript
handler: function (response) {
  // Redirect to order success page with payment details
  router.push(`/order-success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`);
}
```

**Action**: User sees order confirmation page
**Data Written**: None yet - waiting for webhook

---

### **Step 7: Razorpay Webhook Notification** 🔥 **MOST IMPORTANT**
**Razorpay**: Sends webhook to your backend independently

**Lambda: `verify-payment.ts`** (Already implemented)
```typescript
// 1. Receive webhook from Razorpay
const payload = body;
const signature = headers['x-razorpay-signature'];

// 2. Verify webhook signature
const secret = await secretsManager.getSecretValue({ SecretId: 'test_secret' });
const { 'api:secret': key_secret } = JSON.parse(secret.SecretString);
const isValid = verifyWebhookSignature(JSON.stringify(payload), signature, key_secret);

if (!isValid) {
  return { statusCode: 400, body: 'Invalid signature' };
}

// 3. Extract payment data
const event = payload.event; // e.g., "payment.captured"
const paymentEntity = payload.payload.payment.entity;

// 4. Write to table-tennis-orders
const orderItem = {
  orderId: paymentEntity.order_id,
  customerId: paymentEntity.notes.customerEmail || 'guest',
  customerName: paymentEntity.notes.customerName,
  customerEmail: paymentEntity.email,
  customerPhone: paymentEntity.contact,
  razorpayOrderId: paymentEntity.order_id,
  razorpayPaymentId: paymentEntity.id,
  totalAmount: paymentEntity.amount / 100, // Convert paise to rupees
  status: 'confirmed',
  paymentStatus: paymentEntity.status,
  items: JSON.parse(paymentEntity.notes.cartItems || '[]'),
  shippingAddress: JSON.parse(paymentEntity.notes.shippingAddress || '{}'),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

await dynamoDB.send(new PutCommand({
  TableName: 'table-tennis-orders',
  Item: orderItem
}));
```

**✅ Data Written to**: `table-tennis-orders` table
**API Endpoint**: `POST /payment/webhook`

---

### **Step 8: Future Enhancement - Write to Additional Tables**

**Modify `verify-payment.ts` to write to multiple tables:**

```typescript
// After verifying webhook signature...

// 1. Write to table-tennis-orders (already done ✅)
await dynamoDB.send(new PutCommand({
  TableName: 'table-tennis-orders',
  Item: orderItem
}));

// 2. Write to table-tennis-payments (NEW ✨)
const paymentItem = {
  paymentId: paymentEntity.id,
  orderId: paymentEntity.order_id,
  razorpayOrderId: paymentEntity.order_id,
  razorpayPaymentId: paymentEntity.id,
  customerId: paymentEntity.notes.customerEmail || 'guest',
  amount: paymentEntity.amount,
  currency: paymentEntity.currency,
  status: paymentEntity.status, // 'captured', 'authorized', 'failed'
  method: paymentEntity.method, // 'card', 'upi', 'netbanking'
  email: paymentEntity.email,
  contact: paymentEntity.contact,
  createdAt: new Date(paymentEntity.created_at * 1000).toISOString(),
  capturedAt: paymentEntity.captured ? new Date().toISOString() : null,
  failureReason: paymentEntity.error_description || null
};

await dynamoDB.send(new PutCommand({
  TableName: 'table-tennis-payments',
  Item: paymentItem
}));

// 3. Create/Update customer in table-tennis-customers (NEW ✨)
const customerId = paymentEntity.notes.customerEmail || `guest-${Date.now()}`;
const customerItem = {
  customerId: customerId,
  email: paymentEntity.email,
  name: paymentEntity.notes.customerName,
  phone: paymentEntity.contact,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

await dynamoDB.send(new PutCommand({
  TableName: 'table-tennis-customers',
  Item: customerItem
}));

// 4. Save shipping address to table-tennis-addresses (NEW ✨)
const shippingAddress = JSON.parse(paymentEntity.notes.shippingAddress || '{}');
const addressId = `addr-${Date.now()}`;
const addressItem = {
  addressId: addressId,
  customerId: customerId,
  name: shippingAddress.name || paymentEntity.notes.customerName,
  phone: shippingAddress.phone || paymentEntity.contact,
  addressLine1: shippingAddress.addressLine1,
  addressLine2: shippingAddress.addressLine2 || '',
  city: shippingAddress.city,
  state: shippingAddress.state,
  pincode: shippingAddress.pincode,
  landmark: shippingAddress.landmark || '',
  addressType: 'shipping',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

await dynamoDB.send(new PutCommand({
  TableName: 'table-tennis-addresses',
  Item: addressItem
}));
```

---

### **Step 9: Order Fulfillment (Manual/Future Automation)**

**Admin Dashboard** (Future development):
1. Admin logs into admin panel
2. Views new orders from `table-tennis-orders` table (status = 'confirmed')
3. Prepares order for shipment
4. Updates order status to 'processing'

**Shiprocket Integration** (Future Lambda):
```typescript
// Lambda: create-shipment.ts
// 1. Get order details from table-tennis-orders
const order = await dynamoDB.send(new GetCommand({
  TableName: 'table-tennis-orders',
  Key: { orderId, customerId }
}));

// 2. Create shipment with Shiprocket API
const shiprocketResponse = await createShiprocketOrder({
  order_id: order.orderId,
  order_date: order.createdAt,
  pickup_location: 'Pune Warehouse',
  billing_customer_name: order.customerName,
  billing_address: order.shippingAddress.addressLine1,
  billing_city: order.shippingAddress.city,
  billing_pincode: order.shippingAddress.pincode,
  billing_phone: order.customerPhone,
  shipping_is_billing: true,
  order_items: order.items,
  payment_method: 'Prepaid',
  sub_total: order.totalAmount
});

// 3. Write to table-tennis-shipments
const shipmentItem = {
  shipmentId: `ship-${Date.now()}`,
  orderId: order.orderId,
  shiprocketOrderId: shiprocketResponse.order_id,
  trackingNumber: shiprocketResponse.awb_code,
  courierName: shiprocketResponse.courier_name,
  status: 'pending',
  estimatedDelivery: shiprocketResponse.estimated_delivery_date,
  shippingAddress: order.shippingAddress,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

await dynamoDB.send(new PutCommand({
  TableName: 'table-tennis-shipments',
  Item: shipmentItem
}));

// 4. Update order status
await dynamoDB.send(new UpdateCommand({
  TableName: 'table-tennis-orders',
  Key: { orderId: order.orderId, customerId: order.customerId },
  UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
  ExpressionAttributeNames: {
    '#status': 'status',
    '#updatedAt': 'updatedAt'
  },
  ExpressionAttributeValues: {
    ':status': 'shipped',
    ':updatedAt': new Date().toISOString()
  }
}));
```

---

### **Step 10: Shipment Tracking**

**Shiprocket Webhook** (Future implementation):
```typescript
// Lambda: shiprocket-webhook.ts
// Receives tracking updates from Shiprocket
// Updates table-tennis-shipments with latest status

const shipmentUpdate = {
  status: webhook.status, // 'picked', 'in_transit', 'out_for_delivery', 'delivered'
  updatedAt: new Date().toISOString(),
  actualDelivery: webhook.status === 'delivered' ? new Date().toISOString() : null
};

await dynamoDB.send(new UpdateCommand({
  TableName: 'table-tennis-shipments',
  Key: { shipmentId, orderId },
  UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt, #actualDelivery = :actualDelivery',
  ExpressionAttributeNames: {
    '#status': 'status',
    '#updatedAt': 'updatedAt',
    '#actualDelivery': 'actualDelivery'
  },
  ExpressionAttributeValues: {
    ':status': shipmentUpdate.status,
    ':updatedAt': shipmentUpdate.updatedAt,
    ':actualDelivery': shipmentUpdate.actualDelivery
  }
}));
```

---

## Summary: Which Tables Get Populated When

| Table | When | By Which Lambda | Trigger |
|-------|------|-----------------|---------|
| **table-tennis-orders** | ✅ Step 7 | `verify-payment.ts` | Razorpay webhook |
| **table-tennis-payments** | 🔜 Step 8 | `verify-payment.ts` (enhanced) | Razorpay webhook |
| **table-tennis-customers** | 🔜 Step 8 | `verify-payment.ts` (enhanced) | Razorpay webhook |
| **table-tennis-addresses** | 🔜 Step 8 | `verify-payment.ts` (enhanced) | Razorpay webhook |
| **table-tennis-products** | 📦 Manual/Admin | Admin panel or migration script | Product catalog setup |
| **table-tennis-shipments** | 🚚 Step 9 | `create-shipment.ts` (future) | Manual trigger or scheduled job |

---

## Current Status vs. Full Implementation

### ✅ Currently Working:
1. Products displayed from static file (`equipmentData.ts`)
2. Cart management (client-side)
3. Payment order creation (`create-order.ts`)
4. Razorpay payment modal
5. Payment webhook verification (`verify-payment.ts`)
6. Writing to `table-tennis-orders` table

### 🔜 Needs Implementation:
1. Enhanced webhook to write to all 4 tables (payments, customers, addresses)
2. Products Lambda to query `table-tennis-products` table
3. Shiprocket integration for shipment creation
4. Shiprocket webhook for tracking updates
5. Admin dashboard to manage orders
6. Customer dashboard to view order history

---

## Next Steps to Complete the Flow

1. **Deploy the new DynamoDB tables**:
   ```bash
   npx cdk deploy DynamoDbTablesStack
   ```

2. **Enhance `verify-payment.ts` Lambda** to write to all tables

3. **Migrate product data** from `equipmentData.ts` to `table-tennis-products` table

4. **Create new Lambda** to fetch products from DynamoDB instead of static file

5. **Set up Shiprocket account** and implement shipment creation

6. **Build admin dashboard** for order management
