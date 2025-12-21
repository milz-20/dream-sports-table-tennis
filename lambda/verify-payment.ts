import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as crypto from 'crypto';

// AWS_REGION is automatically set by Lambda runtime
const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });
const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

interface WebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        method: string;
        email: string;
        contact: string;
        created_at: number;
        notes?: any;
      };
    };
  };
}

async function getRazorpaySecret() {
  const secretName = process.env.RAZORPAY_SECRET_NAME || 'test_secret';
  
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsManager.send(command);
    
    if (!response.SecretString) {
      throw new Error('Secret string not found');
    }
    
    const secret = JSON.parse(response.SecretString);
    return secret['api:secret'];
  } catch (error) {
    console.error('Error fetching Razorpay secret:', error);
    throw error;
  }
}

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
}

async function saveOrderToDatabase(payment: any, orderDetails: any) {
  const ordersTableName = process.env.ORDERS_TABLE_NAME || 'table-tennis-orders';
  
  const orderItem = {
    orderId: payment.order_id,
    orderDate: new Date().toISOString(),
    paymentId: payment.id,
    amount: payment.amount / 100, // Convert from paise to rupees
    currency: payment.currency,
    status: payment.status === 'captured' ? 'paid' : payment.status,
    paymentMethod: payment.method,
    customerEmail: payment.email,
    customerPhone: payment.contact,
    notes: payment.notes || {},
    createdAt: new Date(payment.created_at * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    ...orderDetails,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: ordersTableName,
        Item: orderItem,
      })
    );
    console.log('Order saved to database:', orderItem.orderId);
  } catch (error) {
    console.error('Error saving order to database:', error);
    throw error;
  }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    // Get Razorpay webhook signature from headers
    const signature = event.headers['x-razorpay-signature'] || event.headers['X-Razorpay-Signature'];
    
    if (!signature) {
      console.error('Missing webhook signature');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing webhook signature' }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    // Get Razorpay webhook secret
    const webhookSecret = await getRazorpaySecret();

    // Verify webhook signature
    const isValid = verifyWebhookSignature(event.body, signature, webhookSecret);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    // Parse webhook payload
    const payload: WebhookPayload = JSON.parse(event.body);
    console.log('Webhook event:', payload.event);

    // Handle payment.captured event
    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      
      console.log('Payment captured:', {
        paymentId: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        status: payment.status,
      });

      // Extract order details from notes if available
      const orderDetails = {
        customerName: payment.notes?.customerName || '',
        customerAddress: payment.notes?.customerAddress || '',
        customerCity: payment.notes?.customerCity || '',
        customerPincode: payment.notes?.customerPincode || '',
        items: payment.notes?.items || '',
      };

      // Save order to DynamoDB
      await saveOrderToDatabase(payment, orderDetails);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Payment captured and order saved',
        }),
      };
    }

    // Handle payment.failed event
    if (payload.event === 'payment.failed') {
      const payment = payload.payload.payment.entity;
      
      console.log('Payment failed:', {
        paymentId: payment.id,
        orderId: payment.order_id,
        status: payment.status,
      });

      // You can add logic here to handle failed payments
      // e.g., send notification, update database, etc.
    }

    // Acknowledge other events
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Webhook received',
      }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
