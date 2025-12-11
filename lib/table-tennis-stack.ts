import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as iam from 'aws-cdk-lib/aws-iam';

export class TableTennisInfraStack extends cdk.Stack {
  public readonly amplifyApp: amplify.CfnApp;
  public readonly mainBranch: amplify.CfnBranch;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    // AWS Amplify Hosting App
    // Connected to GitHub repository: milz-20/dream-sports-table-tennis
    this.amplifyApp = new amplify.CfnApp(this, 'TableTennisWebAppV2', {
      name: 'table-tennis-website',
      description: 'Table Tennis Coaching and Equipment Business Website',
      platform: 'WEB_COMPUTE',
      repository: 'https://github.com/milz-20/dream-sports-table-tennis',
      accessToken: process.env.GITHUB_TOKEN, // Store in AWS Secrets Manager or SSM Parameter Store
      enableBranchAutoDeletion: true,
      iamServiceRole: this.createAmplifyRole().roleArn,
      buildSpec: `version: 1
applications:
  - appRoot: web-nextjs
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
            - echo '{"version":1,"framework":"next","imageOptimization":{"path":"/_next/image","loader":"default"}}' > .next/deploy-manifest.json
            - cp -r .next/standalone/. .next/
            - cp -r .next/static .next/standalone/.next/
            - cp -r public .next/standalone/
      artifacts:
        baseDirectory: .next/standalone
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
    app:
      startCommand: node server.js`,
      environmentVariables: [
        {
          name: 'REACT_APP_AWS_REGION',
          value: this.region,
        },
      ],
    });

    // Create branch for Amplify (using shadCNTailwindUI branch)
    this.mainBranch = new amplify.CfnBranch(this, 'MainBranchV2', {
      appId: this.amplifyApp.attrAppId,
      branchName: 'shadCNTailwindUI',
      enableAutoBuild: true,
      enablePullRequestPreview: true,
      stage: 'PRODUCTION',
    });

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
      value: this.amplifyApp.attrAppId,
      description: 'Amplify App ID',
      exportName: 'TableTennis-AmplifyAppId',
    });

    new cdk.CfnOutput(this, 'AmplifyDefaultDomain', {
      value: this.amplifyApp.attrDefaultDomain,
      description: 'Amplify Default Domain',
      exportName: 'TableTennis-AmplifyDefaultDomain',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://main.${this.amplifyApp.attrDefaultDomain}`,
      description: 'Website URL',
    });
  }

  private createAmplifyRole(): iam.Role {
    const role = new iam.Role(this, 'AmplifyRole', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
      description: 'IAM role for Amplify to access AWS resources',
    });

    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-Amplify')
    );

    return role;
  }
}
