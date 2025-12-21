import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

// AWS_REGION is automatically set by Lambda runtime
const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderRequest {
  amount: number; // Amount in rupees
  currency?: string;
  receipt?: string;
  notes?: {
    customerId?: string; // Customer ID from login/signup
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
    customerCity?: string;
    customerPincode?: string;
    items?: string; // JSON stringified array of CartItem
  };
}

async function getRazorpayCredentials() {
  const secretName = process.env.RAZORPAY_SECRET_NAME || 'test_secret';
  
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsManager.send(command);
    
    if (!response.SecretString) {
      throw new Error('Secret string not found');
    }
    
    const secret = JSON.parse(response.SecretString);
    return {
      key_id: secret['api:key'],
      key_secret: secret['api:secret']
    };
  } catch (error) {
    console.error('Error fetching Razorpay credentials:', error);
    throw error;
  }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const requestBody: OrderRequest = JSON.parse(event.body);

    // Validate amount
    if (!requestBody.amount || requestBody.amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid amount is required' }),
      };
    }

    // Get Razorpay credentials from Secrets Manager
    const credentials = await getRazorpayCredentials();

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: credentials.key_id,
      key_secret: credentials.key_secret,
    });

    // Create Razorpay order
    // Amount should be in paise (smallest currency unit)
    
    const timestamp = new Date().toISOString();
    const orderId = uuidv4();
    
    // Add orderId and createdAt to notes for webhook processing
    const orderNotes = {
      ...requestBody.notes,
      orderId: orderId,
      createdAt: timestamp,
    };
    
    const options = {
      amount: Math.round(requestBody.amount * 100), // Convert to paise
      currency: requestBody.currency || 'INR',
      receipt: requestBody.receipt || `receipt_${Date.now()}`,
      notes: orderNotes,
    };

    const order = await razorpay.orders.create(options);

    // ========================================
    // SAVE DATA TO DYNAMODB TABLES
    // ========================================
    
    // Customer ID should be passed from frontend (after login/signup)
    // If not provided, throw error (customer must be logged in)
    const existingCustomerId = requestBody.notes?.customerId;
    if (!existingCustomerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Customer ID is required. User must be logged in.',
        }),
      };
    }
    
    const addressId = uuidv4();
    const paymentId = uuidv4();

    try {
      // 1. Save Address to Addresses table
      if (requestBody.notes?.customerAddress) {
        const address = {
          addressId: addressId,
          ownerId: existingCustomerId, // Links to existing customer (cst_xxx)
          Address: requestBody.notes.customerAddress,
          City: requestBody.notes.customerCity || '',
          Pincode: requestBody.notes.customerPincode || '',
          isdefault: true,
          CreatedAt: timestamp,
          UpdatedAt: timestamp,
          ReceiversName: requestBody.notes.customerName || '',
          ReceiversNumber: requestBody.notes.customerPhone || '',
        };

        await docClient.send(new PutCommand({
          TableName: process.env.ADDRESSES_TABLE!,
          Item: address,
        }));
        console.log('Address saved:', addressId);
      }

      // Customer record should already exist in table (created during signup)
      // No need to insert customer here

      // 2. Parse cart items
      let cartItems: CartItem[] = [];
      if (requestBody.notes?.items) {
        try {
          cartItems = JSON.parse(requestBody.notes.items);
        } catch (e) {
          console.error('Failed to parse cart items:', e);
        }
      }

      // 3. Save Order with exact field structure
      const orderData = {
        orderId: orderId,
        createdAt: timestamp, // Required sort key
        customerId: existingCustomerId,
        status: 'pending',
        totalAmount: requestBody.amount,
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        shippingAddressId: addressId,
        orderItems: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await docClient.send(new PutCommand({
        TableName: process.env.ORDERS_TABLE!,
        Item: orderData,
      }));
      console.log('Order saved:', orderId);

      // 4. Save Payment record
      const payment = {
        paymentId: paymentId,
        orderId: orderId, // Required sort key
        customerId: existingCustomerId,
        razorpayOrderId: order.id,
        amount: requestBody.amount,
        currency: 'INR',
        status: 'pending',
        method: '', // Will be filled by webhook with actual payment method
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await docClient.send(new PutCommand({
        TableName: process.env.PAYMENTS_TABLE!,
        Item: payment,
      }));
      console.log('Payment record saved:', paymentId);

    } catch (dbError) {
      console.error('Error saving to DynamoDB:', dbError);
      // Don't fail the order creation if DB save fails
      // The order was already created in Razorpay
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
        },
        key_id: credentials.key_id, // Send key_id to frontend for Razorpay checkout
        // Additional IDs for tracking
        customerId: existingCustomerId,
        orderId: orderId,
        paymentId: paymentId,
      }),
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
