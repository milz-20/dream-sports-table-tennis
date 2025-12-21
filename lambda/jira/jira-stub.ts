import fs from 'fs';
import path from 'path';

const LOG_PATH = path.resolve(__dirname, '..', 'delivery', 'delivery_jira_log.jsonl');

export interface JiraTicketPayload {
  id: string;
  orderId: string;
  category: 'delivery' | 'payment' | 'stock' | 'database' | 'api' | 'unknown';
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  errorMessage?: string;
  errorStack?: string;
  context?: {
    orderId?: string;
    customerId?: string;
    paymentId?: string;
    razorpayOrderId?: string;
    amount?: number;
    shipmentId?: string;
    awb?: string;
    orderStatus?: string;
    paymentStatus?: string;
    orderItems?: any[];
    customerEmail?: string;
    customerPhone?: string;
    shippingAddress?: any;
    [key: string]: any;
  };
  createdAt: string;
  environment: string;
}

/**
 * Enhanced Jira ticket creator with detailed error context
 * 
 * @param orderId - The order ID related to the issue
 * @param issue - Brief description of the issue
 * @param options - Additional context and categorization
 */
export async function createJiraTicket(
  orderId: string, 
  issue: string, 
  options?: {
    category?: JiraTicketPayload['category'];
    severity?: JiraTicketPayload['severity'];
    error?: Error | any;
    context?: JiraTicketPayload['context'];
  }
): Promise<JiraTicketPayload> {
  
  const category = options?.category || 'unknown';
  const severity = options?.severity || 'medium';
  const error = options?.error;
  const context = options?.context || {};

  const payload: JiraTicketPayload = {
    id: `JIRA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    category,
    severity,
    issue,
    errorMessage: error?.message || error?.toString(),
    errorStack: error?.stack,
    context: {
      ...context,
      orderId, // Ensure orderId is always in context
    },
    createdAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || process.env.ENVIRONMENT || 'development',
  };

  const line = JSON.stringify(payload) + '\n';
  
  try {
    // Ensure directory exists
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.appendFileSync(LOG_PATH, line);
    console.warn(`[jira-stub] Created ${severity} ${category} ticket ${payload.id} for order ${orderId}`);
    console.warn(`[jira-stub] Issue: ${issue}`);
    if (error) {
      console.warn(`[jira-stub] Error: ${error.message || error}`);
    }
  } catch (err) {
    console.error('[jira-stub] Failed to write ticket:', err);
  }
  
  return payload;
}

/**
 * Helper to create delivery-specific tickets
 */
export async function createDeliveryFailureTicket(
  orderId: string,
  stage: 'shipment_creation' | 'pickup_scheduling' | 'status_update' | 'duplicate_prevention',
  error: Error | any,
  orderContext?: any
) {
  return createJiraTicket(orderId, `Delivery failure at ${stage}`, {
    category: 'delivery',
    severity: 'high',
    error,
    context: {
      deliveryStage: stage,
      ...orderContext,
    },
  });
}

/**
 * Helper to create payment-specific tickets
 */
export async function createPaymentFailureTicket(
  orderId: string,
  stage: 'webhook_signature' | 'order_update' | 'payment_update' | 'razorpay_api',
  error: Error | any,
  paymentContext?: any
) {
  return createJiraTicket(orderId, `Payment processing failure at ${stage}`, {
    category: 'payment',
    severity: 'critical',
    error,
    context: {
      paymentStage: stage,
      ...paymentContext,
    },
  });
}

/**
 * Helper to create stock-related tickets
 */
export async function createStockFailureTicket(
  orderId: string,
  productId: string,
  error: Error | any,
  stockContext?: any
) {
  return createJiraTicket(orderId, `Stock update failed for product ${productId}`, {
    category: 'stock',
    severity: 'high',
    error,
    context: {
      productId,
      ...stockContext,
    },
  });
}

export default { 
  createJiraTicket, 
  createDeliveryFailureTicket,
  createPaymentFailureTicket,
  createStockFailureTicket,
};

