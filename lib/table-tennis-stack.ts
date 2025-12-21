import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
// Import table interfaces for type safety
import {
  ProductItem,
  CustomerItem,
  AddressItem,
  OrderItem,
  PaymentItem,
  ShipmentItem
} from './table-interfaces';

export class TableTennisInfraStack extends cdk.Stack {
  public readonly amplifyAppId: string;
  public readonly mainBranch: amplify.CfnBranch;

  // Expose table references for other stacks
  public readonly productsTable: dynamodb.Table;
  public readonly customersTable: dynamodb.Table;
  public readonly addressesTable: dynamodb.Table;
  public readonly ordersTable: dynamodb.Table;
  public readonly paymentsTable: dynamodb.Table;
  public readonly shipmentsTable: dynamodb.Table;
  public readonly sellersTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use existing Amplify app ID from ap-south-1 region
    // App: dream-sports-table-tennis (d34u3bzjibnwqi)
    this.amplifyAppId = 'd34u3bzjibnwqi';

    // ========================================
    // DYNAMODB TABLES
    // ========================================
    // See DYNAMODB-DOCUMENTATION.md for detailed field specifications
    // and table-interfaces.ts for TypeScript type definitions

    // 1. Products Table
    this.productsTable = new dynamodb.Table(this, 'ProductsTable', {
      tableName: 'table-tennis-products',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sellerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSIs for Products table
    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.productsTable.addGlobalSecondaryIndex({
      indexName: 'BrandIndex',
      partitionKey: { name: 'brand', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'name', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 2. Customers Table
    this.customersTable = new dynamodb.Table(this, 'CustomersTable', {
      tableName: 'table-tennis-customers',
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for phone lookup
    this.customersTable.addGlobalSecondaryIndex({
      indexName: 'PhoneIndex',
      partitionKey: { name: 'phone', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 3. Addresses Table
    this.addressesTable = new dynamodb.Table(this, 'AddressesTable', {
      tableName: 'table-tennis-addresses',
      partitionKey: { name: 'addressId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for owner lookup (customers or sellers)
    this.addressesTable.addGlobalSecondaryIndex({
      indexName: 'OwnerIndex',
      partitionKey: { name: 'ownerId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 4. Orders Table
    this.ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'table-tennis-orders',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSIs for Orders table
    this.ordersTable.addGlobalSecondaryIndex({
      indexName: 'CustomerOrdersIndex',
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.ordersTable.addGlobalSecondaryIndex({
      indexName: 'StatusIndex',
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 5. Payments Table
    this.paymentsTable = new dynamodb.Table(this, 'PaymentsTable', {
      tableName: 'table-tennis-payments',
      partitionKey: { name: 'paymentId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for Razorpay order lookup
    this.paymentsTable.addGlobalSecondaryIndex({
      indexName: 'RazorpayIndex',
      partitionKey: { name: 'razorpayOrderId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 6. Shipments Table
    this.shipmentsTable = new dynamodb.Table(this, 'ShipmentsTable', {
      tableName: 'table-tennis-shipments',
      partitionKey: { name: 'shipmentId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for ShipRocket order lookup
    this.shipmentsTable.addGlobalSecondaryIndex({
      indexName: 'ShiprocketIndex',
      partitionKey: { name: 'shiprocketOrderId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI for tracking number lookup
    this.shipmentsTable.addGlobalSecondaryIndex({
      indexName: 'TrackingIndex',
      partitionKey: { name: 'trackingNumber', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 7. Sellers Table
    this.sellersTable = new dynamodb.Table(this, 'SellersTable', {
      tableName: 'table-tennis-sellers',
      partitionKey: { name: 'sellerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for email lookup
    this.sellersTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ========================================
    // LAMBDA FUNCTIONS FOR PAYMENT
    // ========================================

    // Create Order Lambda Function
    const createOrderFunction = new lambda.Function(this, 'CreateOrderFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'create-order.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../lambda/dist')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        RAZORPAY_SECRET_NAME: 'test_secret',
        PRODUCTS_TABLE: this.productsTable.tableName,
        CUSTOMERS_TABLE: this.customersTable.tableName,
        ADDRESSES_TABLE: this.addressesTable.tableName,
        ORDERS_TABLE: this.ordersTable.tableName,
        PAYMENTS_TABLE: this.paymentsTable.tableName,
      },
    });

    // Grant permissions to Lambda
    this.productsTable.grantReadWriteData(createOrderFunction);
    this.customersTable.grantReadWriteData(createOrderFunction);
    this.addressesTable.grantReadWriteData(createOrderFunction);
    this.ordersTable.grantReadWriteData(createOrderFunction);
    this.paymentsTable.grantReadWriteData(createOrderFunction);

    // Payment Webhook Lambda Function
    const webhookFunction = new lambda.Function(this, 'PaymentWebhookFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'verify-payment.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../lambda/dist')),
      timeout: cdk.Duration.seconds(60), // Increased for shipment creation + notifications
      memorySize: 512, // Increased for additional processing
      environment: {
        RAZORPAY_SECRET_NAME: 'test_secret',
        ORDERS_TABLE_NAME: this.ordersTable.tableName,
        PAYMENTS_TABLE_NAME: this.paymentsTable.tableName,
        PRODUCTS_TABLE_NAME: this.productsTable.tableName,
        SELLERS_TABLE_NAME: this.sellersTable.tableName,
        CUSTOMERS_TABLE_NAME: this.customersTable.tableName,
        ADDRESSES_TABLE_NAME: this.addressesTable.tableName,
        SHIPMENTS_TABLE_NAME: this.shipmentsTable.tableName,
        // Shiprocket configuration
        USE_AWS_SECRETS: 'true',
        SHIPROCKET_SECRET_NAME: 'shipRocket-delivery-credentials',
        SHIPROCKET_DRY_RUN: 'true', // Set to 'false' in production
        SHIPROCKET_PICKUP_LOCATION: 'Default Pickup',
        SHIPROCKET_CHANNEL_ID: '1',
        SHIPROCKET_PICKUP_TIME: '10:00-18:00',
        // Twilio WhatsApp configuration
        TWILIO_SECRET_NAME: 'twilio-whatsapp-credentials',
        APP_URL: 'https://yourdomain.com', // Update with your actual domain
      },
    });

    // Grant permissions to Lambda functions
    createOrderFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['secretsmanager:GetSecretValue'],
      resources: [`arn:aws:secretsmanager:${this.region}:${this.account}:secret:test_secret-*`],
    }));

    webhookFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['secretsmanager:GetSecretValue'],
      resources: [
        `arn:aws:secretsmanager:${this.region}:${this.account}:secret:test_secret-*`,
        `arn:aws:secretsmanager:${this.region}:${this.account}:secret:shipRocket-delivery-credentials-*`,
        `arn:aws:secretsmanager:${this.region}:${this.account}:secret:twilio-whatsapp-credentials-*`,
      ],
    }));

    // Grant DynamoDB write permissions to webhook function
    this.ordersTable.grantReadWriteData(webhookFunction);
    this.paymentsTable.grantReadWriteData(webhookFunction);
    this.productsTable.grantReadWriteData(webhookFunction);
    this.sellersTable.grantReadWriteData(webhookFunction);
    this.customersTable.grantReadData(webhookFunction); // Read customer details for shipment
    this.addressesTable.grantReadData(webhookFunction); // Read address for shipment
    this.shipmentsTable.grantReadWriteData(webhookFunction); // Create and update shipments
    
    // Grant read permissions to get product and seller details
    this.productsTable.grantReadData(webhookFunction);
    this.sellersTable.grantReadData(webhookFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'PaymentApi', {
      restApiName: 'Table Tennis Payment API',
      description: 'API for Razorpay payment integration',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Razorpay-Signature'],
      },
      deployOptions: {
        stageName: 'prod',
        throttlingBurstLimit: 100,
        throttlingRateLimit: 50,
      },
    });

    // API Gateway endpoints
    const payment = api.root.addResource('payment');
    
    const createOrder = payment.addResource('create-order');
    createOrder.addMethod('POST', new apigateway.LambdaIntegration(createOrderFunction));

    const webhook = payment.addResource('webhook');
    webhook.addMethod('POST', new apigateway.LambdaIntegration(webhookFunction));

    // AWS Amplify - Managing existing app: dream-sports-table-tennis
    // App ID: d34u3bzjibnwqi in ap-south-1 region
    // Connected to GitHub repository: milz-20/dream-sports-table-tennis
    
    // Note: The existing branch 'shadCNTailwindUI' is already configured in the console
    // Custom domain 'allabouttabletennis.in' already exists and is managed in Amplify Console
    // Commenting out to avoid "AlreadyExists" error during deployment
    /*
    const customDomain = new amplify.CfnDomain(this, 'CustomDomain', {
      appId: this.amplifyAppId,
      domainName: 'allabouttabletennis.in',
      enableAutoSubDomain: false,
      subDomainSettings: [
        {
          branchName: 'shadCNTailwindUI', // Existing branch name
          prefix: '', // Root domain
        },
        {
          branchName: 'shadCNTailwindUI',
          prefix: 'www', // www subdomain
        },
      ],
    });
    */

    // ========================================
    // CLOUDFORMATION OUTPUTS
    // ========================================

    // DynamoDB Tables
    new cdk.CfnOutput(this, 'ProductsTableName', {
      value: this.productsTable.tableName,
      description: 'DynamoDB Products Table Name',
      exportName: 'TableTennis-ProductsTable',
    });

    new cdk.CfnOutput(this, 'CustomersTableName', {
      value: this.customersTable.tableName,
      description: 'DynamoDB Customers Table Name',
      exportName: 'TableTennis-CustomersTable',
    });

    new cdk.CfnOutput(this, 'AddressesTableName', {
      value: this.addressesTable.tableName,
      description: 'DynamoDB Addresses Table Name',
      exportName: 'TableTennis-AddressesTable',
    });

    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: this.ordersTable.tableName,
      description: 'DynamoDB Orders Table Name',
      exportName: 'TableTennis-OrdersTable',
    });

    new cdk.CfnOutput(this, 'PaymentsTableName', {
      value: this.paymentsTable.tableName,
      description: 'DynamoDB Payments Table Name',
      exportName: 'TableTennis-PaymentsTable',
    });

    new cdk.CfnOutput(this, 'ShipmentsTableName', {
      value: this.shipmentsTable.tableName,
      description: 'DynamoDB Shipments Table Name',
      exportName: 'TableTennis-ShipmentsTable',
    });

    // Amplify Outputs
    new cdk.CfnOutput(this, 'AmplifyAppId', {
      value: this.amplifyAppId,
      description: 'Amplify App ID',
      exportName: 'TableTennis-AmplifyAppId',
    });

    new cdk.CfnOutput(this, 'AmplifyDefaultDomain', {
      value: 'd34u3bzjibnwqi.amplifyapp.com',
      description: 'Amplify Default Domain',
      exportName: 'TableTennis-AmplifyDefaultDomain',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: 'https://shadcntailwindui.d34u3bzjibnwqi.amplifyapp.com',
      description: 'Current Website URL',
    });

    new cdk.CfnOutput(this, 'CustomDomainName', {
      value: 'allabouttabletennis.in',
      description: 'Custom Domain Name (Managed in Amplify Console)',
      exportName: 'TableTennis-CustomDomain',
    });

    // Payment API Outputs
    new cdk.CfnOutput(this, 'PaymentApiUrl', {
      value: api.url,
      description: 'Payment API Gateway URL',
      exportName: 'TableTennis-PaymentApiUrl',
    });

    new cdk.CfnOutput(this, 'CreateOrderEndpoint', {
      value: `${api.url}payment/create-order`,
      description: 'Create Order Endpoint',
    });

    new cdk.CfnOutput(this, 'WebhookEndpoint', {
      value: `${api.url}payment/webhook`,
      description: 'Razorpay Webhook Endpoint',
    });
  }
}
