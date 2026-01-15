const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

const testCustomers = [
  {
    customerId: 'cst_test001',
    email: 'test1@example.com',
    name: 'Test Customer 1',
    phone: '+919876543210',
  },
  {
    customerId: 'cst_test002',
    email: 'test2@example.com',
    name: 'Test Customer 2',
    phone: '+919876543211',
  },
  {
    customerId: 'cst_test003',
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '+919876543212',
  },
];

async function createTestCustomers() {
  console.log('Creating test customers...');
  
  for (const customer of testCustomers) {
    try {
      await docClient.send(new PutCommand({
        TableName: 'table-tennis-customers',
        Item: customer,
      }));
      console.log(`✓ Created customer: ${customer.customerId} (${customer.name})`);
    } catch (error) {
      console.error(`✗ Failed to create ${customer.customerId}:`, error.message);
    }
  }
  
  console.log('\nTest customers created! Use these IDs:');
  testCustomers.forEach(c => {
    console.log(`  - ${c.customerId}: ${c.name} (${c.email})`);
  });
}

createTestCustomers();
