const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Two initial sellers
const sellers = [
  {
    sellerId: 'sell_87c5006bfefa403eb06dae62c33bc0e8',
    name: 'Premium Table Tennis Store',
    email: 'premium@tabletennis.com',
    phone: '+919876543210',
    bankDetails: {
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountHolderName: 'Premium Table Tennis Store'
    },
    totalSales: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    sellerId: 'sell_001',
    name: 'Table Tennis Pro Shop',
    email: 'proshop@tabletennis.com',
    phone: '+919876543211',
    bankDetails: {
      accountNumber: '0987654321',
      ifscCode: 'ICIC0001234',
      bankName: 'ICICI Bank',
      accountHolderName: 'Table Tennis Pro Shop'
    },
    totalSales: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function populateSellers() {
  console.log('Starting to populate sellers...\n');

  for (const seller of sellers) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'table-tennis-sellers',
        Item: seller,
      }));

      console.log(`✅ Added: ${seller.name} (${seller.sellerId})`);
    } catch (error) {
      console.error(`❌ Error adding ${seller.name}:`, error.message);
    }
  }

  console.log('\n✅ Sellers population complete!');
}

populateSellers().catch(console.error);
