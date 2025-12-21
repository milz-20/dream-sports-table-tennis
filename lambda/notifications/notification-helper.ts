/**
 * Notification Helper Functions
 * 
 * Helper functions to fetch seller details and prepare notification data
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Get seller details by sellerId
 */
export async function getSellerDetails(sellerId: string): Promise<{
  sellerId: string;
  name: string;
  phone: string;
  email: string;
} | null> {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.SELLERS_TABLE_NAME || 'table-tennis-sellers',
      Key: {
        sellerId,
      },
    }));

    if (!result.Item) {
      console.error(`[notification-helper] Seller not found: ${sellerId}`);
      return null;
    }

    return {
      sellerId: result.Item.sellerId,
      name: result.Item.name || result.Item.businessName || 'Seller',
      phone: result.Item.phone || result.Item.phoneNumber,
      email: result.Item.email,
    };
  } catch (error) {
    console.error('[notification-helper] Error fetching seller:', error);
    return null;
  }
}

/**
 * Get seller ID from product
 */
export async function getSellerIdFromProduct(productId: string): Promise<string | null> {
  try {
    // Query Products table to get seller ID
    const result = await docClient.send(new QueryCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME || 'table-tennis-products',
      KeyConditionExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': productId,
      },
      Limit: 1,
    }));

    if (!result.Items || result.Items.length === 0) {
      console.error(`[notification-helper] Product not found: ${productId}`);
      return null;
    }

    return result.Items[0].sellerId;
  } catch (error) {
    console.error('[notification-helper] Error fetching product seller:', error);
    return null;
  }
}

/**
 * Group order items by seller
 */
export async function groupOrderItemsBySeller(orderItems: any[]): Promise<Map<string, any[]>> {
  const sellerGroups = new Map<string, any[]>();

  for (const item of orderItems) {
    const sellerId = await getSellerIdFromProduct(item.productId);
    
    if (!sellerId) {
      console.warn(`[notification-helper] Could not find seller for product ${item.productId}`);
      continue;
    }

    if (!sellerGroups.has(sellerId)) {
      sellerGroups.set(sellerId, []);
    }

    sellerGroups.get(sellerId)!.push(item);
  }

  return sellerGroups;
}

export default {
  getSellerDetails,
  getSellerIdFromProduct,
  groupOrderItemsBySeller,
};
