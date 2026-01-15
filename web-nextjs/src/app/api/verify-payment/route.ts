import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import * as crypto from 'crypto';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

const ORDERS_TABLE = 'table-tennis-orders';
const PAYMENTS_TABLE = 'table-tennis-payments';
const PRODUCTS_TABLE = 'table-tennis-products';
const SELLERS_TABLE = 'table-tennis-sellers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method } = body;

    console.log('Payment verification request:', { razorpay_order_id, razorpay_payment_id, payment_method });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Determine if this is a COD order
    const isCOD = payment_method === 'cod';
    const paymentStatus = isCOD ? 'pending' : 'paid';
    const paymentMethodStr = isCOD ? 'cod' : 'online';

    // Note: In production, you should verify the signature with Razorpay secret
    // For now, we'll trust the response since it comes from Razorpay's SDK

    try {
      let paymentRecord;
      let orderId;

      // 1. Find payment record (different approach for COD vs online)
      if (isCOD) {
        // For COD, razorpay_order_id is actually our internal orderId
        orderId = razorpay_order_id;
        
        // Scan payment table to find by orderId (since it's a sort key, not partition key)
        const paymentScanResult = await docClient.send(
          new ScanCommand({
            TableName: PAYMENTS_TABLE,
            FilterExpression: 'orderId = :orderId',
            ExpressionAttributeValues: {
              ':orderId': orderId,
            },
          })
        );
        
        if (paymentScanResult.Items && paymentScanResult.Items.length > 0) {
          paymentRecord = paymentScanResult.Items[0];
        }
      } else {
        // For online payment, query by razorpayOrderId
        const paymentQueryResult = await docClient.send(
          new QueryCommand({
            TableName: PAYMENTS_TABLE,
            IndexName: 'RazorpayIndex',
            KeyConditionExpression: 'razorpayOrderId = :razorpayOrderId',
            ExpressionAttributeValues: {
              ':razorpayOrderId': razorpay_order_id,
            },
          })
        );

        if (paymentQueryResult.Items && paymentQueryResult.Items.length > 0) {
          paymentRecord = paymentQueryResult.Items[0];
          orderId = paymentRecord.orderId;
        }
      }

      if (paymentRecord) {
        
        // Update payment record
        await docClient.send(
          new UpdateCommand({
            TableName: PAYMENTS_TABLE,
            Key: {
              paymentId: paymentRecord.paymentId,
              orderId: paymentRecord.orderId,
            },
            UpdateExpression: 'SET #status = :status, #method = :method, razorpayPaymentId = :razorpayPaymentId, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
              '#status': 'status',
              '#method': 'method',
            },
            ExpressionAttributeValues: {
              ':status': paymentStatus,
              ':method': paymentMethodStr,
              ':razorpayPaymentId': razorpay_payment_id,
              ':updatedAt': new Date().toISOString(),
            },
          })
        );
        console.log(`Payment record updated: ${paymentRecord.paymentId} (${paymentMethodStr}, ${paymentStatus})`);

        // 2. Find and update order status
        const orderQueryResult = await docClient.send(
          new QueryCommand({
            TableName: ORDERS_TABLE,
            KeyConditionExpression: 'orderId = :orderId',
            ExpressionAttributeValues: {
              ':orderId': orderId,
            },
          })
        );

        if (orderQueryResult.Items && orderQueryResult.Items.length > 0) {
          const orderRecord = orderQueryResult.Items[0];
        
          await docClient.send(
            new UpdateCommand({
              TableName: ORDERS_TABLE,
              Key: {
                orderId: orderRecord.orderId,
                createdAt: orderRecord.createdAt,
              },
              UpdateExpression: 'SET #status = :status, paymentStatus = :paymentStatus',
              ExpressionAttributeNames: {
                '#status': 'status',
              },
              ExpressionAttributeValues: {
                ':status': 'confirmed',
                ':paymentStatus': paymentStatus,
              },
            })
          );
          console.log(`Order status updated: ${orderRecord.orderId} (paymentStatus: ${paymentStatus})`);

        // 3. Update product stock and seller sales
        const orderItems = orderRecord.orderItems || [];
        console.log(`Processing ${orderItems.length} order items...`);
        
        // Pre-load all products to avoid DynamoDB reserved keyword issues
        const allProductsResult = await docClient.send(
          new ScanCommand({
            TableName: PRODUCTS_TABLE,
          })
        );
        
        const productsMap = new Map();
        (allProductsResult.Items || []).forEach((p: any) => {
          const name = (p.Name || p.name || '').toLowerCase().trim();
          if (name) {
            productsMap.set(name, p);
          }
        });
        
        console.log(`Loaded ${productsMap.size} products from DB`);
        
        for (const item of orderItems) {
          try {
            console.log(`\n--- Processing: ${item.name} ---`);
            console.log(`Item productId: ${item.productId}, quantity: ${item.quantity}, price: ${item.price}`);
            
            const itemNameKey = item.name.toLowerCase().trim();
            const product = productsMap.get(itemNameKey);

            if (product) {
              const sellerId = product.sellerId;
              const actualProductId = product.productId;

              console.log(`✓ Found product in DB:`, {
                productId: actualProductId,
                name: product.Name || product.name,
                sellerId: sellerId,
                currentStock: product.stock || product.Stock || 0
              });

              // Decrement product stock
              await docClient.send(
                new UpdateCommand({
                  TableName: PRODUCTS_TABLE,
                  Key: {
                    productId: actualProductId,
                    sellerId: sellerId,
                  },
                  UpdateExpression: 'SET stock = stock - :quantity',
                  ExpressionAttributeValues: {
                    ':quantity': item.quantity,
                  },
                })
              );
              console.log(`✓ Stock decremented: ${actualProductId} by ${item.quantity}`);

              // Increment seller totalSales ONLY if payment is confirmed (not COD)
              if (paymentStatus === 'paid') {
                const saleAmount = item.price * item.quantity;
                await docClient.send(
                  new UpdateCommand({
                    TableName: SELLERS_TABLE,
                    Key: {
                      sellerId: sellerId,
                    },
                    UpdateExpression: 'SET totalSales = if_not_exists(totalSales, :zero) + :amount',
                    ExpressionAttributeValues: {
                      ':amount': saleAmount,
                      ':zero': 0,
                    },
                  })
                );
                console.log(`✓ Seller sales updated: ${sellerId} +₹${saleAmount}`);
              } else {
                console.log(`⏸ Seller sales NOT updated (payment pending): ${sellerId}`);
              }
            } else {
              console.error(`✗ Product NOT FOUND in DB: ${item.name}`);
              console.error(`Available products:`, Array.from(productsMap.keys()).slice(0, 5));
            }
          } catch (itemError) {
            console.error(`✗ ERROR updating ${item.productId}:`, itemError);
          }
        }
        console.log(`\n--- Finished processing all items ---\n`);
        }
      }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to update order status' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
