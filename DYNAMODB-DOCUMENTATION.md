# DynamoDB Table Structure Documentation

## Overview
This document describes the DynamoDB table structure for the Table Tennis E-commerce platform. DynamoDB is a NoSQL database that uses a flexible schema, meaning you can store any attributes in any item as long as the required key attributes are present.

## Key Concepts

### Primary Key (PK) and Sort Key (SK)
- **Partition Key (PK)**: Required for all items. Determines data distribution across partitions.
- **Sort Key (SK)**: Optional. Allows sorting and range queries within a partition.

### Global Secondary Indexes (GSIs)
- Allow querying by different attributes than the primary key
- Each GSI has its own partition key and optional sort key
- GSIs are automatically maintained by DynamoDB

## Table Structures

### 1. Products Table (`table-tennis-products`)
**Primary Key:** `productId` (String) + `sellerId` (String)
**Purpose:** Store product catalog with multi-seller support

**GSIs:**
- `CategoryIndex`: Query products by category
- `BrandIndex`: Query products by brand

### 2. Customers Table (`table-tennis-customers`)
**Primary Key:** `customerId` (String) + `email` (String)
**Purpose:** Store customer information

**GSIs:**
- `PhoneIndex`: Query customers by phone number

### 3. Addresses Table (`table-tennis-addresses`)
**Primary Key:** `addressId` (String)
**Purpose:** Store shipping/billing addresses

### 4. Orders Table (`table-tennis-orders`)
**Primary Key:** `orderId` (String) + `createdAt` (String)
**Purpose:** Store order information

**GSIs:**
- `CustomerOrdersIndex`: Query orders by customer
- `StatusIndex`: Query orders by status

### 5. Payments Table (`table-tennis-payments`)
**Primary Key:** `paymentId` (String) + `orderId` (String)
**Purpose:** Store Razorpay payment information

**GSIs:**
- `RazorpayIndex`: Query payments by Razorpay order ID

### 6. Shipments Table (`table-tennis-shipments`)
**Primary Key:** `shipmentId` (String) + `orderId` (String)
**Purpose:** Store ShipRocket shipment information

**GSIs:**
- `ShiprocketIndex`: Query shipments by ShipRocket order ID
- `TrackingIndex`: Query shipments by tracking number

## Data Types and Formats

### String Formats
- `productId`: `PRD_` + unique identifier (e.g., `PRD_123456`)
- `customerId`, `orderId`, `paymentId`, `shipmentId`: UUID format
- `addressId`: Unique identifier
- Dates: ISO 8601 format (e.g., `2024-01-15T10:30:00Z`)

### Number Fields
- Prices, amounts, costs: Stored as numbers (not strings)
- Quantities, stock: Stored as integers

### Boolean Fields
- `InStock`, `isdefault`: `true` or `false`

### Array Fields
- `orderItems`: Array of objects with product details

## Query Patterns

### Products
- Get specific product: `PK = productId, SK = sellerId`
- Get all products by seller: `PK = productId, SK begins_with sellerId`
- Get products by category: `GSI CategoryIndex, PK = category`
- Get products by brand: `GSI BrandIndex, PK = brand`

### Customers
- Get customer by ID: `PK = customerId, SK = email`
- Get customer by phone: `GSI PhoneIndex, PK = phone`

### Orders
- Get specific order: `PK = orderId, SK = createdAt`
- Get customer's orders: `GSI CustomerOrdersIndex, PK = customerId`
- Get orders by status: `GSI StatusIndex, PK = status`

### Payments
- Get payment details: `PK = paymentId, SK = orderId`
- Get payments by Razorpay order: `GSI RazorpayIndex, PK = razorpayOrderId`

### Shipments
- Get shipment details: `PK = shipmentId, SK = orderId`
- Get shipments by ShipRocket order: `GSI ShiprocketIndex, PK = shiprocketOrderId`
- Get shipment by tracking number: `GSI TrackingIndex, PK = trackingNumber`

## Best Practices

1. **Use UUIDs for IDs**: Ensures uniqueness across distributed systems
2. **Store timestamps as strings**: ISO 8601 format for consistent sorting
3. **Use atomic operations**: For inventory updates and order processing
4. **Implement optimistic locking**: Use version numbers for concurrent updates
5. **Batch operations**: Use batchGetItem and batchWriteItem for multiple items
6. **Query optimization**: Use GSIs strategically to avoid full table scans

## CDK Deployment

The tables are defined in `lib/table-tennis-stack.ts` with:
- Pay-per-request billing for cost optimization
- AWS-managed encryption
- Point-in-time recovery enabled
- RETAIN removal policy for production data

## TypeScript Interfaces

All table structures are defined as TypeScript interfaces in `lib/table-interfaces.ts` for type safety and documentation.