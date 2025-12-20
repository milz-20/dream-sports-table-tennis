import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class TableTennisInfraStack extends cdk.Stack {
  public readonly amplifyAppId: string;
  public readonly mainBranch: amplify.CfnBranch;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use existing Amplify app ID from ap-south-1 region
    // App: dream-sports-table-tennis (d34u3bzjibnwqi)
    this.amplifyAppId = 'd34u3bzjibnwqi';

    // ========================================
    // PAYMENT INTEGRATION - RAZORPAY
    // ========================================

    // Import existing DynamoDB Table for Orders
    const ordersTable = dynamodb.Table.fromTableName(
      this,
      'OrdersTable',
      'table-tennis-orders'
    );

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
      },
    });

    // Payment Webhook Lambda Function
    const webhookFunction = new lambda.Function(this, 'PaymentWebhookFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'verify-payment.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../../lambda/dist')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        RAZORPAY_SECRET_NAME: 'test_secret',
        ORDERS_TABLE_NAME: ordersTable.tableName,
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
      resources: [`arn:aws:secretsmanager:${this.region}:${this.account}:secret:test_secret-*`],
    }));

    // Grant DynamoDB write permissions to webhook function
    ordersTable.grantWriteData(webhookFunction);

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

    // DynamoDB Tables - COMMENTED OUT FOR NOW
    /*
    // 1. Customers Table - Store customer information
    const customersTable = new dynamodb.Table(this, 'CustomersTable', {
      tableName: 'table-tennis-customers',
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // Global Secondary Index for email lookup
    customersTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 2. Coaching Sessions Table - Store coaching session bookings
    const coachingSessionsTable = new dynamodb.Table(this, 'CoachingSessionsTable', {
      tableName: 'table-tennis-coaching-sessions',
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sessionDate', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for querying sessions by customer
    coachingSessionsTable.addGlobalSecondaryIndex({
      indexName: 'CustomerSessionsIndex',
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sessionDate', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI for querying sessions by date
    coachingSessionsTable.addGlobalSecondaryIndex({
      indexName: 'DateIndex',
      partitionKey: { name: 'sessionDate', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 3. Equipment Inventory Table - Store equipment products
    const equipmentTable = new dynamodb.Table(this, 'EquipmentTable', {
      tableName: 'table-tennis-equipment',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for querying by category
    equipmentTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIndex',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'productName', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 4. Orders Table - Store equipment orders
    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'table-tennis-orders',
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'orderDate', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for customer orders
    ordersTable.addGlobalSecondaryIndex({
      indexName: 'CustomerOrdersIndex',
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'orderDate', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // 5. Contact Inquiries Table - Store contact form submissions
    const inquiriesTable = new dynamodb.Table(this, 'InquiriesTable', {
      tableName: 'table-tennis-inquiries',
      partitionKey: { name: 'inquiryId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'submittedDate', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });
    */

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

    // CloudFormation Outputs
    /*
    new cdk.CfnOutput(this, 'CustomersTableName', {
      value: customersTable.tableName,
      description: 'DynamoDB Customers Table Name',
    });

    new cdk.CfnOutput(this, 'CoachingSessionsTableName', {
      value: coachingSessionsTable.tableName,
      description: 'DynamoDB Coaching Sessions Table Name',
    });

    new cdk.CfnOutput(this, 'EquipmentTableName', {
      value: equipmentTable.tableName,
      description: 'DynamoDB Equipment Table Name',
    });

    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: ordersTable.tableName,
      description: 'DynamoDB Orders Table Name',
    });

    new cdk.CfnOutput(this, 'InquiriesTableName', {
      value: inquiriesTable.tableName,
      description: 'DynamoDB Inquiries Table Name',
    });
    */

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

    /*
    new cdk.CfnOutput(this, 'CustomDomainStatus', {
      value: customDomain.attrStatusReason,
      description: 'Custom Domain Status',
    });
    */

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

    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: ordersTable.tableName,
      description: 'DynamoDB Orders Table Name',
    });
  }
}
