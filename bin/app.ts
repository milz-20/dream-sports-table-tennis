#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TableTennisInfraStack } from '../lib/table-tennis-stack';
import { TableTennisBudgetStack } from '../lib/budget-stack';
import { Route53Stack } from '../lib/route53-stack';
import { IamDevelopersStack } from '../lib/iam-developers-stack';

const app = new cdk.App();

// Main infrastructure stack - Using ap-south-1 (Mumbai) where Amplify app exists
const infraStack = new TableTennisInfraStack(app, 'TableTennisInfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'ap-south-1', // Mumbai region where existing Amplify app is located
  },
  description: 'Table Tennis Coaching and Equipment Business Infrastructure',
});

// Route53 DNS stack
new Route53Stack(app, 'Route53Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  description: 'Route53 Hosted Zone for allabouttabletennis.in',
});

// Budget monitoring stack
// Note: AWS Budgets only supports USD. 50 INR ≈ 0.60 USD
new TableTennisBudgetStack(app, 'TableTennisBudgetStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  description: 'Budget monitoring and alerts for Table Tennis infrastructure',
  budgetAmount: 1,
  currency: 'USD',
  email: 'milindkelkar00@gmail.com',
});

// IAM users and permissions for developers
new IamDevelopersStack(app, 'IamDevelopersStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  description: 'IAM users and groups for backend developers',
});

app.synth();
