/**
 * Twilio WhatsApp Notification Service
 * 
 * Sends WhatsApp notifications using Twilio API for:
 * - Customer order confirmations
 * - Seller order notifications
 * - Shipment updates
 * - Delivery confirmations
 * 
 * Features:
 * - AWS Secrets Manager integration for credentials
 * - Retry logic for failed messages
 * - Delivery status tracking
 * - Template-based messages
 */

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import twilio from 'twilio';

const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });

// Cache credentials in memory (Lambda container reuse)
let twilioCredentials: {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
} | null = null;

/**
 * Fetch Twilio credentials from AWS Secrets Manager
 */
async function getTwilioCredentials() {
  if (twilioCredentials) {
    return twilioCredentials;
  }

  const secretName = process.env.TWILIO_SECRET_NAME || 'twilio-whatsapp-credentials';
  
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsManager.send(command);
    
    if (!response.SecretString) {
      throw new Error('Twilio secret string not found');
    }
    
    twilioCredentials = JSON.parse(response.SecretString);
    console.log('[twilio] Credentials loaded successfully');
    return twilioCredentials!;
  } catch (error) {
    console.error('[twilio] Error fetching credentials:', error);
    throw error;
  }
}

/**
 * Create Twilio client
 */
async function getTwilioClient() {
  const credentials = await getTwilioCredentials();
  return twilio(credentials.accountSid, credentials.authToken);
}

/**
 * Format phone number for WhatsApp (ensure +91 prefix for India)
 */
function formatPhoneNumber(phone: string): string {
  // Remove any spaces, dashes, or parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If doesn't start with +, add +91 for India
  if (!cleaned.startsWith('+')) {
    // If starts with 91, add +
    if (cleaned.startsWith('91')) {
      cleaned = '+' + cleaned;
    } else {
      // Add +91
      cleaned = '+91' + cleaned;
    }
  }
  
  return `whatsapp:${cleaned}`;
}

/**
 * Send WhatsApp message with retry logic
 */
async function sendWhatsAppMessage(
  to: string,
  message: string,
  options?: {
    mediaUrl?: string;
    retries?: number;
  }
): Promise<{ success: boolean; sid?: string; error?: string }> {
  const retries = options?.retries ?? 2;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const client = await getTwilioClient();
      const credentials = await getTwilioCredentials();
      
      const messageOptions: any = {
        from: formatPhoneNumber(credentials.whatsappNumber),
        to: formatPhoneNumber(to),
        body: message,
      };
      
      if (options?.mediaUrl) {
        messageOptions.mediaUrl = [options.mediaUrl];
      }
      
      const result = await client.messages.create(messageOptions);
      
      console.log(`[twilio] Message sent successfully to ${to}, SID: ${result.sid}`);
      
      return {
        success: true,
        sid: result.sid,
      };
      
    } catch (error: any) {
      console.error(`[twilio] Attempt ${attempt + 1} failed for ${to}:`, error.message);
      
      if (attempt === retries) {
        return {
          success: false,
          error: error.message,
        };
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  return {
    success: false,
    error: 'Max retries exceeded',
  };
}

/**
 * Send order confirmation to customer
 */
export async function sendCustomerOrderConfirmation(customerData: {
  phone: string;
  firstName: string;
  orderId: string;
  orderAmount: number;
  orderItems: Array<{ name: string; quantity: number }>;
  estimatedDelivery?: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  
  const itemsList = customerData.orderItems
    .map(item => `• ${item.name} (${item.quantity}x)`)
    .join('\n');
  
  const message = `Hi ${customerData.firstName}! 👋

Your order has been confirmed! 🎉

*Order ID:* ${customerData.orderId}
*Amount:* ₹${customerData.orderAmount}

*Items:*
${itemsList}

*Estimated Delivery:* ${customerData.estimatedDelivery || '3-5 business days'}

Track your order: ${process.env.APP_URL || 'https://yourdomain.com'}/track/${customerData.orderId}

Thank you for shopping with us! 🎾

- Dream Sports Table Tennis`;

  console.log(`[twilio] Sending order confirmation to customer ${customerData.phone}`);
  return await sendWhatsAppMessage(customerData.phone, message);
}

/**
 * Send new order notification to seller
 */
export async function sendSellerOrderNotification(sellerData: {
  phone: string;
  sellerName: string;
  orderId: string;
  orderAmount: number;
  customerName: string;
  orderItems: Array<{ productId: string; name: string; quantity: number; price: number }>;
  shippingAddress: {
    line1: string;
    city: string;
    pincode: string;
    state: string;
  };
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  
  const itemsList = sellerData.orderItems
    .map(item => `• ${item.name} - ${item.quantity}x (₹${item.price * item.quantity})`)
    .join('\n');
  
  const message = `🔔 *New Order Received!*

*Order ID:* ${sellerData.orderId}
*Total Amount:* ₹${sellerData.orderAmount}

*Customer:* ${sellerData.customerName}

*Products:*
${itemsList}

*Shipping To:*
${sellerData.shippingAddress.line1}
${sellerData.shippingAddress.city}, ${sellerData.shippingAddress.state} - ${sellerData.shippingAddress.pincode}

*Action Required:*
Please prepare the items for shipment. 📦

View order details: ${process.env.APP_URL || 'https://yourdomain.com'}/seller/orders/${sellerData.orderId}

- Dream Sports Table Tennis`;

  console.log(`[twilio] Sending order notification to seller ${sellerData.phone}`);
  return await sendWhatsAppMessage(sellerData.phone, message);
}

/**
 * Send shipment created notification to customer
 */
export async function sendShipmentCreatedNotification(customerData: {
  phone: string;
  firstName: string;
  orderId: string;
  awb: string;
  courierName?: string;
  trackingUrl?: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  
  const message = `Hi ${customerData.firstName}! 📦

Great news! Your order has been shipped! 🚚

*Order ID:* ${customerData.orderId}
*Tracking Number (AWB):* ${customerData.awb}
${customerData.courierName ? `*Courier:* ${customerData.courierName}` : ''}

Track your shipment: ${customerData.trackingUrl || `https://shiprocket.co/tracking/${customerData.awb}`}

You'll receive your order soon!

- Dream Sports Table Tennis`;

  console.log(`[twilio] Sending shipment notification to customer ${customerData.phone}`);
  return await sendWhatsAppMessage(customerData.phone, message);
}

/**
 * Send out for delivery notification to customer
 */
export async function sendOutForDeliveryNotification(customerData: {
  phone: string;
  firstName: string;
  orderId: string;
  awb: string;
  estimatedDelivery?: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  
  const message = `Hi ${customerData.firstName}! 🚚

Your order is out for delivery today! 

*Order ID:* ${customerData.orderId}
*Tracking Number:* ${customerData.awb}
${customerData.estimatedDelivery ? `*Expected Delivery:* ${customerData.estimatedDelivery}` : ''}

Please be available to receive your order. 📦

- Dream Sports Table Tennis`;

  console.log(`[twilio] Sending out-for-delivery notification to ${customerData.phone}`);
  return await sendWhatsAppMessage(customerData.phone, message);
}

/**
 * Send delivered confirmation to customer
 */
export async function sendDeliveredNotification(customerData: {
  phone: string;
  firstName: string;
  orderId: string;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  
  const message = `Hi ${customerData.firstName}! ✅

Your order has been delivered successfully! 🎉

*Order ID:* ${customerData.orderId}

We hope you love your purchase! 💚

Rate your experience: ${process.env.APP_URL || 'https://yourdomain.com'}/review/${customerData.orderId}

Thank you for choosing Dream Sports Table Tennis! 🎾

Need help? Reply to this message.`;

  console.log(`[twilio] Sending delivered confirmation to ${customerData.phone}`);
  return await sendWhatsAppMessage(customerData.phone, message);
}

/**
 * Send payment failed notification to customer
 */
export async function sendPaymentFailedNotification(customerData: {
  phone: string;
  firstName: string;
  orderId: string;
  amount: number;
}): Promise<{ success: boolean; sid?: string; error?: string }> {
  
  const message = `Hi ${customerData.firstName},

We're sorry, but your payment for order *${customerData.orderId}* could not be processed. 😔

*Amount:* ₹${customerData.amount}

Please try again or contact us for assistance.

Retry payment: ${process.env.APP_URL || 'https://yourdomain.com'}/retry-payment/${customerData.orderId}

Need help? Reply to this message or call us.

- Dream Sports Table Tennis`;

  console.log(`[twilio] Sending payment failed notification to ${customerData.phone}`);
  return await sendWhatsAppMessage(customerData.phone, message);
}

export default {
  sendCustomerOrderConfirmation,
  sendSellerOrderNotification,
  sendShipmentCreatedNotification,
  sendOutForDeliveryNotification,
  sendDeliveredNotification,
  sendPaymentFailedNotification,
};
