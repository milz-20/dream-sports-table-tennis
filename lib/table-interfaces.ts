// ========================================
// DYNAMODB TABLE INTERFACES
// ========================================

// 1. Products Table Interface
export interface ProductItem {
  productId: string; // PK: PRD_unique format
  sellerId: string;  // SK: Unique seller identifier
  name: string;
  brand: string; // butterfly, stiga, tibhar, etc.
  category: 'blade' | 'rubber' | 'shoe' | 'preowned';
  price: number; // Current selling price in INR
  originalPrice: number; // MRP in INR
  stock: number; // Current available stock
  InStock: boolean; // true, false
  discount?: number; // Discount percentage
  addressId?: string; // From Address table
  // Additional fields that might be added later
}

// 2. Customers Table Interface
export interface CustomerItem {
  customerId: string; // PK: UUID format
  email: string;     // SK: Customer email
  phone: string;     // 10-digit mobile number
  name: string;      // Full customer name
  // Additional fields that might be added later
}

// 3. Addresses Table Interface
export interface AddressItem {
  addressId: string; // PK: Unique address identifier
  ownerId: string; // Can be customerId (cst_) or sellerId (sell_)
  address: string;
  city: string;
  pincode: string;
  isdefault: boolean;
  createdAt: string;
  updatedAt: string;
  receiverName: string; // Receiver's name
  receiverNumber: string; // Receiver's phone number
}

// 4. Orders Table Interface
export interface OrderItem {
  orderId: string; // PK: UUID format
  createdAt: string; // SK: ISO 8601 date format
  customerId: string; // FK to Customers table
  status: 'pending' | 'confirmed' | 'processing' | 'ready_for_shipment' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number; // Total order amount in INR
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddressId: string;
  orderItems: OrderItemDetail[];
  shippedAt?: string; // ISO 8601 date format
  deliveredAt?: string; // ISO 8601 date format
  // Additional fields that might be added later
}

export interface OrderItemDetail {
  productId: string; // FK to Products table
  name: string; // Product name at time of order
  quantity: number;
  price: number; // Price at time of order
}

// 5. Payments Table Interface
export interface PaymentItem {
  paymentId: string; // PK: UUID format
  orderId: string;   // SK: FK to Orders table
  customerId: string; // FK to Customers table
  razorpayOrderId: string; // Razorpay order ID
  razorpayPaymentId?: string; // Razorpay payment ID
  amount: number; // Payment amount in INR
  currency: 'INR';
  status: 'created' | 'attempted' | 'paid' | 'failed';
  method: 'card' | 'netbanking' | 'wallet' | 'upi' | 'cod';
  paidAt?: string; // ISO 8601 date format
  // Additional fields that might be added later
}

// 6. Shipments Table Interface
export interface ShipmentItem {
  shipmentId: string; // PK: UUID format
  orderId: string;    // SK: FK to Orders table
  customerId: string; // FK to Customers table
  shiprocketOrderId: string; // ShipRocket order ID
  trackingNumber?: string; // AWB number
  trackingUrl?: string; // Tracking URL
  status: 'pending' | 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  courierName?: string; // Courier company name
  shippingCost: number; // Shipping charges in INR
  deliveredAt?: string; // ISO 8601 date format
  // Additional fields that might be added later
}

// ========================================
// UTILITY TYPES
// ========================================

// DynamoDB Key interfaces for queries
export interface ProductKey {
  productId: string;
  sellerId: string;
}

export interface CustomerKey {
  customerId: string;
  email: string;
}

export interface AddressKey {
  addressId: string;
}

export interface OrderKey {
  orderId: string;
  createdAt: string;
}

export interface PaymentKey {
  paymentId: string;
  orderId: string;
}

export interface ShipmentKey {
  shipmentId: string;
  orderId: string;
}

// GSI Key interfaces
export interface ProductCategoryKey {
  category: string;
  name: string;
}

export interface ProductBrandKey {
  brand: string;
  name: string;
}

export interface CustomerPhoneKey {
  phone: string;
}

export interface OrderCustomerKey {
  customerId: string;
  createdAt: string;
}

export interface OrderStatusKey {
  status: string;
  createdAt: string;
}

export interface PaymentRazorpayKey {
  razorpayOrderId: string;
}

export interface ShipmentShiprocketKey {
  shiprocketOrderId: string;
}

export interface ShipmentTrackingKey {
  trackingNumber: string;
}