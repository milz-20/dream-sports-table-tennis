import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import Razorpay from 'razorpay';

// AWS_REGION is automatically set by Lambda runtime
const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });

interface OrderRequest {
  amount: number; // Amount in rupees
  currency?: string;
  receipt?: string;
  notes?: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    items?: string;
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
    const options = {
      amount: Math.round(requestBody.amount * 100), // Convert to paise
      currency: requestBody.currency || 'INR',
      receipt: requestBody.receipt || `receipt_${Date.now()}`,
      notes: requestBody.notes || {},
    };

    const order = await razorpay.orders.create(options);

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
