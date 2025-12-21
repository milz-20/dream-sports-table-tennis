import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import * as crypto from 'crypto';

// Import delivery integration
import { runDelivery } from './delivery/delivery-controller';
import { createDynamoAdapter } from './delivery/storage-adapter-dynamo';
import { getOrderWithDetails } from './order-fetcher';
import { createDeliveryFailureTicket, createPaymentFailureTicket } from './jira/jira-stub';

// Import notification services
import {
  sendCustomerOrderConfirmation,
  sendSellerOrderNotification,
  sendShipmentCreatedNotification,
  sendPaymentFailedNotification,
} from './notifications/twilio-whatsapp';
import { groupOrderItemsBySeller, getSellerDetails } from './notifications/notification-helper';

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

/**
 * Update payment record with method and status
 */
async function updatePaymentRecord(razorpayOrderId: string, paymentMethod: string, status: string) {
  const paymentsTableName = process.env.PAYMENTS_TABLE_NAME || 'table-tennis-payments';
  
  try {
    // Query by razorpayOrderId using GSI to get the payment record
    const queryResult = await docClient.send(
      new QueryCommand({
        TableName: paymentsTableName,
        IndexName: 'RazorpayIndex',
        KeyConditionExpression: 'razorpayOrderId = :razorpayOrderId',
        ExpressionAttributeValues: {
          ':razorpayOrderId': razorpayOrderId,
        },
      })
    );

    if (!queryResult.Items || queryResult.Items.length === 0) {
      console.error('Payment record not found for razorpayOrderId:', razorpayOrderId);
      return;
    }

    const paymentRecord = queryResult.Items[0];
    
    // Update the payment record with actual keys
    await docClient.send(
      new UpdateCommand({
        TableName: paymentsTableName,
        Key: {
          paymentId: paymentRecord.paymentId,
          orderId: paymentRecord.orderId,
        },
        UpdateExpression: 'SET #method = :method, #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#method': 'method',
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':method': paymentMethod,
          ':status': status,
          ':updatedAt': new Date().toISOString(),
        },
      })
    );
    console.log('Payment record updated:', paymentRecord.paymentId);
  } catch (error) {
    console.error('Error updating payment record:', error);
    throw error;
  }
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId: string, createdAt: string, status: string, paymentStatus: string) {
  const ordersTableName = process.env.ORDERS_TABLE_NAME || 'table-tennis-orders';
  
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: ordersTableName,
        Key: {
          orderId: orderId,
          createdAt: createdAt,
        },
        UpdateExpression: 'SET #status = :status, paymentStatus = :paymentStatus',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':paymentStatus': paymentStatus,
        },
      })
    );
    console.log('Order status updated:', orderId);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Decrement product stock and increment seller totalSales
 */
async function updateProductStockAndSellerSales(orderItems: any[]) {
  const productsTableName = process.env.PRODUCTS_TABLE_NAME || 'table-tennis-products';
  const sellersTableName = process.env.SELLERS_TABLE_NAME || 'table-tennis-sellers';

  for (const item of orderItems) {
    try {
      // Query product by productId to get all details including sellerId
      // Since Products table has productId (PK) and sellerId (SK), we need to query
      const productQuery = await docClient.send(
        new QueryCommand({
          TableName: productsTableName,
          KeyConditionExpression: 'productId = :productId',
          ExpressionAttributeValues: {
            ':productId': item.productId,
          },
          Limit: 1,
        })
      );

      if (!productQuery.Items || productQuery.Items.length === 0) {
        console.error('Product not found:', item.productId);
        continue;
      }

      const product = productQuery.Items[0];
      const sellerId = product.sellerId;

      // Decrement product stock
      await docClient.send(
        new UpdateCommand({
          TableName: productsTableName,
          Key: {
            productId: item.productId,
            sellerId: sellerId,
          },
          UpdateExpression: 'SET stock = stock - :quantity',
          ExpressionAttributeValues: {
            ':quantity': item.quantity,
          },
        })
      );
      console.log(`Product stock decremented: ${item.productId} by ${item.quantity}`);

      // Increment seller totalSales
      const saleAmount = item.price * item.quantity;
      await docClient.send(
        new UpdateCommand({
          TableName: sellersTableName,
          Key: {
            sellerId: sellerId,
          },
          UpdateExpression: 'SET totalSales = totalSales + :amount',
          ExpressionAttributeValues: {
            ':amount': saleAmount,
          },
        })
      );
      console.log(`Seller totalSales incremented: ${sellerId} by ${saleAmount}`);
    } catch (error) {
      console.error(`Error updating product/seller for item ${item.productId}:`, error);
      // Continue processing other items even if one fails
    }
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
        method: payment.method,
      });

      // Extract orderId and orderItems from notes
      const notes = payment.notes || {};
      const orderId = notes.orderId || payment.order_id;
      const createdAt = notes.createdAt || new Date().toISOString();
      let orderItems: any[] = [];
      
      try {
        orderItems = notes.items ? JSON.parse(notes.items) : [];
      } catch (e) {
        console.error('Failed to parse order items from notes:', e);
      }

      // 1. Update payment record with method and status
      await updatePaymentRecord(
        payment.order_id,
        payment.method, // card, upi, netbanking, wallet, etc.
        'completed'
      );

      // 2. Update order status to confirmed and payment status to paid
      await updateOrderStatus(
        orderId,
        createdAt,
        'confirmed',
        'paid'
      );

      // 3. Decrement product stock and increment seller totalSales
      if (orderItems.length > 0) {
        await updateProductStockAndSellerSales(orderItems);
      }

      // 4. TRIGGER SHIPMENT CREATION
      console.log(`[webhook] Triggering shipment creation for order ${orderId}`);
      let shipmentResult = null;
      try {
        // Fetch complete order data with customer and address details
        const orderData = await getOrderWithDetails(orderId, createdAt);
        
        if (!orderData) {
          console.error(`[webhook] Failed to fetch order data for ${orderId}`);
          await createDeliveryFailureTicket(
            orderId,
            'shipment_creation',
            new Error('Order data not found in DynamoDB'),
            {
              orderId,
              customerId: payment.notes?.customerId,
              razorpayOrderId: payment.order_id,
              amount: payment.amount,
            }
          );
        } else {
          // Call runDelivery with DynamoDB storage adapter
          const storageAdapter = createDynamoAdapter();
          shipmentResult = await runDelivery(orderData, {
            notifyPhone: orderData.customer.phone,
            storage: storageAdapter,
          });

          if (!shipmentResult.ok) {
            console.error(`[webhook] Delivery creation failed for ${orderId}:`, shipmentResult.error);
            await createDeliveryFailureTicket(
              orderId,
              'shipment_creation',
              new Error(shipmentResult.error || 'Unknown delivery error'),
              {
                orderId,
                customerId: orderData.customerId,
                customerEmail: orderData.customer.email,
                customerPhone: orderData.customer.phone,
                orderAmount: orderData.totalAmount,
                paymentMethod: payment.method,
              }
            );
          } else {
            console.log(`[webhook] Shipment created successfully for ${orderId}:`, {
              shipmentId: shipmentResult.shiprocket?.shipment_id,
              awb: shipmentResult.shiprocket?.awb_code,
              fromCache: shipmentResult.fromCache,
            });

            // 5. Update order with shipment details
            try {
              await docClient.send(
                new UpdateCommand({
                  TableName: process.env.ORDERS_TABLE_NAME || 'table-tennis-orders',
                  Key: {
                    orderId: orderId,
                    createdAt: createdAt,
                  },
                  UpdateExpression: 'SET shipmentId = :shipmentId, awb = :awb, shipmentStatus = :shipmentStatus, shipmentCreatedAt = :timestamp',
                  ExpressionAttributeValues: {
                    ':shipmentId': shipmentResult.shiprocket?.shipment_id || null,
                    ':awb': shipmentResult.shiprocket?.awb_code || null,
                    ':shipmentStatus': 'pending_pickup',
                    ':timestamp': new Date().toISOString(),
                  },
                })
              );
              console.log(`[webhook] Order ${orderId} updated with shipment details`);
            } catch (updateError) {
              console.error(`[webhook] Failed to update order with shipment details:`, updateError);
              // Non-blocking - shipment was created, just failed to update order record
            }
          }
        }
      } catch (deliveryError: any) {
        console.error(`[webhook] Unexpected error during shipment creation for ${orderId}:`, deliveryError);
        await createDeliveryFailureTicket(
          orderId,
          'shipment_creation',
          deliveryError,
          {
            orderId,
            razorpayOrderId: payment.order_id,
            paymentId: payment.id,
            errorMessage: deliveryError.message,
            errorStack: deliveryError.stack,
          }
        );
        // Don't fail the webhook - payment was successful and order is confirmed
      }

      // 6. SEND WHATSAPP NOTIFICATIONS
      console.log(`[webhook] Sending WhatsApp notifications for order ${orderId}`);
      try {
        // Fetch complete order data for notifications
        const orderData = await getOrderWithDetails(orderId, createdAt);
        
        if (orderData) {
          // Send customer notification
          const customerNotification = await sendCustomerOrderConfirmation({
            phone: orderData.customer.phone,
            firstName: orderData.customer.firstName,
            orderId: orderData.id,
            orderAmount: orderData.totalAmount,
            orderItems: orderData.items,
            estimatedDelivery: '3-5 business days',
          });

          if (customerNotification.success) {
            console.log(`[webhook] Customer notification sent successfully, SID: ${customerNotification.sid}`);
          } else {
            console.error(`[webhook] Customer notification failed:`, customerNotification.error);
          }

          // Send seller notifications (group by seller)
          const sellerGroups = await groupOrderItemsBySeller(orderData.orderItems);
          
          for (const [sellerId, sellerItems] of sellerGroups.entries()) {
            const sellerDetails = await getSellerDetails(sellerId);
            
            if (sellerDetails && sellerDetails.phone) {
              const sellerNotification = await sendSellerOrderNotification({
                phone: sellerDetails.phone,
                sellerName: sellerDetails.name,
                orderId: orderData.id,
                orderAmount: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                customerName: `${orderData.customer.firstName} ${orderData.customer.lastName || ''}`.trim(),
                orderItems: sellerItems,
                shippingAddress: orderData.shippingAddress,
              });

              if (sellerNotification.success) {
                console.log(`[webhook] Seller notification sent to ${sellerId}, SID: ${sellerNotification.sid}`);
              } else {
                console.error(`[webhook] Seller notification failed for ${sellerId}:`, sellerNotification.error);
              }
            } else {
              console.warn(`[webhook] Seller ${sellerId} details not found or missing phone`);
            }
          }

          // Send shipment created notification (if shipment was created)
          if (shipmentResult && shipmentResult.ok && shipmentResult.shiprocket?.awb_code) {
            const shipmentNotification = await sendShipmentCreatedNotification({
              phone: orderData.customer.phone,
              firstName: orderData.customer.firstName,
              orderId: orderData.id,
              awb: shipmentResult.shiprocket.awb_code,
              courierName: shipmentResult.shiprocket.courier_name,
            });

            if (shipmentNotification.success) {
              console.log(`[webhook] Shipment notification sent, SID: ${shipmentNotification.sid}`);
            } else {
              console.error(`[webhook] Shipment notification failed:`, shipmentNotification.error);
            }
          }
        }
      } catch (notificationError: any) {
        console.error(`[webhook] Error sending notifications for ${orderId}:`, notificationError);
        // Non-blocking - don't fail the webhook if notifications fail
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Payment captured, order confirmed, stock updated, shipment initiated, notifications sent',
          shipment: shipmentResult ? {
            created: shipmentResult.ok,
            shipmentId: shipmentResult.shiprocket?.shipment_id,
            awb: shipmentResult.shiprocket?.awb_code,
            fromCache: shipmentResult.fromCache,
          } : null,
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

      const notes = payment.notes || {};
      const orderId = notes.orderId || payment.order_id;
      const createdAt = notes.createdAt || new Date().toISOString();

      // Update payment status to failed
      await updatePaymentRecord(
        payment.order_id,
        payment.method || 'unknown',
        'failed'
      );

      // Update order status to failed
      await updateOrderStatus(
        orderId,
        createdAt,
        'failed',
        'failed'
      );

      // Send payment failed notification to customer
      try {
        const orderData = await getOrderWithDetails(orderId, createdAt);
        if (orderData) {
          await sendPaymentFailedNotification({
            phone: orderData.customer.phone,
            firstName: orderData.customer.firstName,
            orderId: orderData.id,
            amount: orderData.totalAmount,
          });
          console.log(`[webhook] Payment failed notification sent for order ${orderId}`);
        }
      } catch (notificationError) {
        console.error(`[webhook] Failed to send payment failed notification:`, notificationError);
        // Non-blocking
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Payment failed, order updated, notification sent',
        }),
      };
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
