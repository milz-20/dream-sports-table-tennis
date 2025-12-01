#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TableTennisInfraStack } from '../lib/table-tennis-stack';
import { TableTennisBudgetStack } from '../lib/budget-stack';

const app = new cdk.App();

// Main infrastructure stack
new TableTennisInfraStack(app, 'TableTennisInfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  description: 'Table Tennis Coaching and Equipment Business Infrastructure',
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

app.synth();
