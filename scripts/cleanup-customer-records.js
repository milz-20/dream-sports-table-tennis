// Script to remove actualCustomerId field from existing customer records
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-south-1" });
const docClient = DynamoDBDocumentClient.from(client);

const CUSTOMERS_TABLE = "table-tennis-customers";

async function cleanupRecords() {
  try {
    console.log("Scanning for records with actualCustomerId...");
    
    // Scan for records with actualCustomerId
    const scanResult = await docClient.send(
      new ScanCommand({
        TableName: CUSTOMERS_TABLE,
        FilterExpression: "attribute_exists(actualCustomerId)",
      })
    );

    console.log(`Found ${scanResult.Items?.length || 0} records with actualCustomerId`);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      console.log("No records to clean up!");
      return;
    }

    // Remove actualCustomerId from each record
    for (const item of scanResult.Items) {
      console.log(`Removing actualCustomerId from ${item.email}...`);
      
      await docClient.send(
        new UpdateCommand({
          TableName: CUSTOMERS_TABLE,
          Key: {
            customerId: item.customerId,
            email: item.email,
          },
          UpdateExpression: "REMOVE actualCustomerId",
        })
      );
      
      console.log(`✓ Cleaned up ${item.email}`);
    }

    console.log("\n✅ All records cleaned up successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

cleanupRecords();
