import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoDbTablesStack extends cdk.Stack {
  public readonly customersTable: dynamodb.Table;
  public readonly ordersTable: dynamodb.Table;
  public readonly paymentsTable: dynamodb.Table;
  public readonly productsTable: dynamodb.Table;
  public readonly addressesTable: dynamodb.Table;
  public readonly shipmentsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ========================================
    // CUSTOMERS TABLE
    // ========================================
    this.customersTable = new dynamodb.Table(this, 'CustomersTable', {
      tableName: 'table-tennis-customers',
      partitionKey: {
        name: 'customerId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'email',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Phone Index for customer lookup by phone
    this.customersTable.addGlobalSecondaryIndex({
      indexName: 'PhoneIndex',
      partitionKey: {
        name: 'phone',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ========================================
    // ORDERS TABLE (Already exists - import it)
    // ========================================
    this.ordersTable = dynamodb.Table.fromTableName(
      this,
      'OrdersTable',
      'table-tennis-orders'
    );

    // ========================================
    // PAYMENTS TABLE
    // ========================================
    this.paymentsTable = new dynamodb.Table(this, 'PaymentsTable', {
      tableName: 'table-tennis-payments',
      partitionKey: {
        name: 'paymentId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'orderId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Razorpay Index for looking up payments by Razorpay order ID
    this.paymentsTable.addGlobalSecondaryIndex({
      indexName: 'RazorpayIndex',
      partitionKey: {
        name: 'razorpayOrderId',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ========================================
    // PRODUCTS TABLE
    // ========================================
    this.productsTable = new dynamodb.Table(this, 'ProductsTable', {
      tableName: 'table-tennis-products',
      partitionKey: {
        name: 'productId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sellerId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Category Index for browsing products by category
    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: {
        name: 'category',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'name',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Brand Index for browsing products by brand
    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'BrandIndex',
      partitionKey: {
        name: 'brand',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'name',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ========================================
    // ADDRESSES TABLE
    // ========================================
    this.addressesTable = new dynamodb.Table(this, 'AddressesTable', {
      tableName: 'table-tennis-addresses',
      partitionKey: {
        name: 'addressId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // ========================================
    // SHIPMENTS TABLE
    // ========================================
    this.shipmentsTable = new dynamodb.Table(this, 'ShipmentsTable', {
      tableName: 'table-tennis-shipments',
      partitionKey: {
        name: 'shipmentId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'orderId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Shiprocket Index for integration with Shiprocket API
    this.shipmentsTable.addGlobalSecondaryIndex({
      indexName: 'ShiprocketIndex',
      partitionKey: {
        name: 'shiprocketOrderId',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Tracking Index for customer tracking number lookup
    this.shipmentsTable.addGlobalSecondaryIndex({
      indexName: 'TrackingIndex',
      partitionKey: {
        name: 'trackingNumber',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ========================================
    // OUTPUTS
    // ========================================
    new cdk.CfnOutput(this, 'CustomersTableName', {
      value: this.customersTable.tableName,
      description: 'Customers DynamoDB Table Name',
      exportName: 'TableTennis-CustomersTable',
    });

    new cdk.CfnOutput(this, 'PaymentsTableName', {
      value: this.paymentsTable.tableName,
      description: 'Payments DynamoDB Table Name',
      exportName: 'TableTennis-PaymentsTable',
    });

    new cdk.CfnOutput(this, 'ProductsTableName', {
      value: this.productsTable.tableName,
      description: 'Products DynamoDB Table Name',
      exportName: 'TableTennis-ProductsTable',
    });

    new cdk.CfnOutput(this, 'AddressesTableName', {
      value: this.addressesTable.tableName,
      description: 'Addresses DynamoDB Table Name',
      exportName: 'TableTennis-AddressesTable',
    });

    new cdk.CfnOutput(this, 'ShipmentsTableName', {
      value: this.shipmentsTable.tableName,
      description: 'Shipments DynamoDB Table Name',
      exportName: 'TableTennis-ShipmentsTable',
    });
  }
}
