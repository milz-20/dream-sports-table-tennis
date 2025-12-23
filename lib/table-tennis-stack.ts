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

    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: ordersTable.tableName,
      description: 'DynamoDB Orders Table Name',
    });
  }
}
