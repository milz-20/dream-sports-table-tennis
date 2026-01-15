const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

// Import product data
const blades = [
  { name: 'Butterfly Timo Boll ALC', brand: 'Butterfly', category: 'blade', price: 19999, originalPrice: 22999 },
  { name: 'Butterfly Zhang Jike ALC', brand: 'Butterfly', category: 'blade', price: 13849, originalPrice: 15999 },
  { name: 'Butterfly Lin Yun-Ju Super ZLC', brand: 'Butterfly', category: 'blade', price: 21999, originalPrice: 24999 },
  { name: 'Butterfly Viscaria', brand: 'Butterfly', category: 'blade', price: 16999, originalPrice: 19999 },
  { name: 'Butterfly Innerforce Layer ZLC', brand: 'Butterfly', category: 'blade', price: 18499, originalPrice: 20999 },
  { name: 'Butterfly Harimoto ALC', brand: 'Butterfly', category: 'blade', price: 17999, originalPrice: 19999 },
  { name: 'Butterfly Jun Mizutani ZLC', brand: 'Butterfly', category: 'blade', price: 19499, originalPrice: 21999 },
  { name: 'Butterfly Hadraw Shield', brand: 'Butterfly', category: 'blade', price: 11999, originalPrice: 13999 },
  { name: 'Butterfly Primorac Carbon', brand: 'Butterfly', category: 'blade', price: 14999, originalPrice: 16999 },
  { name: 'Butterfly Fan Zhendong ALC', brand: 'Butterfly', category: 'blade', price: 20999, originalPrice: 23999 },
  { name: 'Butterfly Ma Long Carbon 2', brand: 'Butterfly', category: 'blade', price: 15999, originalPrice: 17999 },
  { name: 'Stiga Clipper Wood', brand: 'Stiga', category: 'blade', price: 8999, originalPrice: 10999 },
  { name: 'Stiga Carbonado 45', brand: 'Stiga', category: 'blade', price: 10999, originalPrice: 12999 },
  { name: 'Stiga Cybershape Carbon', brand: 'Stiga', category: 'blade', price: 12999, originalPrice: 14999 },
  { name: 'Stiga Offensive Classic', brand: 'Stiga', category: 'blade', price: 7499, originalPrice: 8999 },
  { name: 'Yasaka Ma Lin Extra Offensive', brand: 'Yasaka', category: 'blade', price: 6999, originalPrice: 8499 },
  { name: 'Yasaka Sweden Extra', brand: 'Yasaka', category: 'blade', price: 5999, originalPrice: 7499 },
  { name: 'Donic Ovtcharov Carbo Speed', brand: 'Donic', category: 'blade', price: 9999, originalPrice: 11999 },
  { name: 'Donic Waldner Senso Carbon', brand: 'Donic', category: 'blade', price: 11499, originalPrice: 13499 },
  { name: 'Donic Samsonov Force Pro', brand: 'Donic', category: 'blade', price: 8499, originalPrice: 10499 },
];

const rubbers = [
  { name: 'Butterfly Tenergy 05', brand: 'Butterfly', category: 'rubber', price: 5499, originalPrice: 6299 },
  { name: 'Butterfly Dignics 09C', brand: 'Butterfly', category: 'rubber', price: 6999, originalPrice: 7999 },
  { name: 'Butterfly Dignics 05', brand: 'Butterfly', category: 'rubber', price: 6499, originalPrice: 7499 },
  { name: 'Butterfly Tenergy 64', brand: 'Butterfly', category: 'rubber', price: 5299, originalPrice: 6099 },
  { name: 'Butterfly Tenergy 80', brand: 'Butterfly', category: 'rubber', price: 5299, originalPrice: 6099 },
  { name: 'Butterfly Rozena', brand: 'Butterfly', category: 'rubber', price: 3999, originalPrice: 4599 },
  { name: 'Butterfly Tenergy 19', brand: 'Butterfly', category: 'rubber', price: 5499, originalPrice: 6299 },
  { name: 'Butterfly Dignics 64', brand: 'Butterfly', category: 'rubber', price: 6499, originalPrice: 7499 },
  { name: 'Butterfly Dignics 80', brand: 'Butterfly', category: 'rubber', price: 6499, originalPrice: 7499 },
  { name: 'Butterfly Sriver FX', brand: 'Butterfly', category: 'rubber', price: 2799, originalPrice: 3299 },
  { name: 'Butterfly Bryce Speed', brand: 'Butterfly', category: 'rubber', price: 4299, originalPrice: 4999 },
  { name: 'Xiom Vega Europe', brand: 'Xiom', category: 'rubber', price: 3499, originalPrice: 4199 },
  { name: 'Xiom Vega Pro', brand: 'Xiom', category: 'rubber', price: 3799, originalPrice: 4499 },
  { name: 'Donic Bluestorm Z1', brand: 'Donic', category: 'rubber', price: 4799, originalPrice: 5599 },
  { name: 'Tibhar Evolution MX-P', brand: 'Tibhar', category: 'rubber', price: 4499, originalPrice: 5299 },
  { name: 'Yasaka Mark V', brand: 'Yasaka', category: 'rubber', price: 2299, originalPrice: 2799 },
  { name: 'Yasaka Rakza 7', brand: 'Yasaka', category: 'rubber', price: 3799, originalPrice: 4499 },
  { name: 'Andro Rasant Powergrip', brand: 'Andro', category: 'rubber', price: 4299, originalPrice: 4999 },
  { name: 'Victas V15 Extra', brand: 'Victas', category: 'rubber', price: 4999, originalPrice: 5799 },
];

const shoes = [
  { name: 'Butterfly Lezoline Zero', brand: 'Butterfly', category: 'shoe', price: 8999, originalPrice: 10999 },
  { name: 'Joola Pro Junior', brand: 'Joola', category: 'shoe', price: 5999, originalPrice: 7499 },
];

const preOwnedRackets = [
  { name: 'Butterfly Viscaria + Tenergy 05 (Both Sides)', brand: 'Butterfly', category: 'preowned', price: 8999, originalPrice: 18000 },
  { name: 'Butterfly Timo Boll ALC + Dignics 09C (FH) + Tenergy 64 (BH)', brand: 'Butterfly', category: 'preowned', price: 10999, originalPrice: 22000 },
  { name: 'Butterfly Zhang Jike ZLC + Tenergy 80 (Both Sides)', brand: 'Butterfly', category: 'preowned', price: 7499, originalPrice: 19000 },
];

const client = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

async function populateProducts() {
  const allProducts = [...blades, ...rubbers, ...shoes, ...preOwnedRackets];
  const sellerIds = ['sell_001', 'sell_87c5006bfefa403eb06dae62c33bc0e8'];

  console.log(`Starting to populate ${allProducts.length} products...`);
  console.log(`Distributing between sellers: ${sellerIds.join(', ')}\n`);

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    // Alternate between sellers
    const sellerId = sellerIds[i % 2];
    
    try {
      const item = {
        productId: randomUUID(),
        sellerId: sellerId,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: 10, // Default stock
        InStock: true,
        discount: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100),
      };

      await docClient.send(new PutCommand({
        TableName: 'table-tennis-products',
        Item: item,
      }));

      console.log(`✅ Added: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error adding ${product.name}:`, error.message);
    }
  }

  console.log('\n✅ Products population complete!');
}

populateProducts().catch(console.error);
