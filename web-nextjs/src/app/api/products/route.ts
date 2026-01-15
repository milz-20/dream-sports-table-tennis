import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE = 'table-tennis-products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    console.log('Fetching products from DynamoDB, category:', category);

    const scanCommand = new ScanCommand({
      TableName: PRODUCTS_TABLE,
    });

    const result = await docClient.send(scanCommand);
    const products = result.Items || [];

    console.log(`Found ${products.length} products in DynamoDB`);

    // Filter by category if specified
    let filteredProducts = products;
    if (category && category !== 'all') {
      filteredProducts = products.filter(p => 
        p.Category?.toLowerCase() === category.toLowerCase() ||
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Transform DynamoDB products to match frontend format
    const transformedProducts = filteredProducts.map(product => ({
      id: product.productId,
      name: product.Name || product.name,
      brand: product.Brand || product.brand || 'Butterfly',
      category: product.Category || product.category || 'Blade',
      rating: product.Rating || product.rating || 4.5,
      reviews: product.Reviews || product.reviews || 0,
      composition: product.Composition || product.composition || '',
      speed: product.Speed || product.speed || '',
      origin: product.Origin || product.origin || 'Made in Japan',
      description: product.Description || product.description || '',
      price: product.Price || product.price || 0,
      originalPrice: product.OriginalPrice || product.originalPrice || product.Price || product.price || 0,
      image: product.ImageURL || product.imageUrl || product.image || '/assets/images/timoBoll.jpg',
      stock: product.stock || product.Stock || 0,
      // Rubber-specific fields
      type: product.Type || product.type,
      hardness: product.Hardness || product.hardness,
      arc: product.Arc || product.arc,
      // Shoes-specific fields
      size: product.Size || product.size,
      color: product.Color || product.color,
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      count: transformedProducts.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
