import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as budgets from 'aws-cdk-lib/aws-budgets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export interface BudgetStackProps extends cdk.StackProps {
  budgetAmount: number;
  currency: string;
  email: string;
}

export class TableTennisBudgetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BudgetStackProps) {
    super(scope, id, props);

    // Create SNS Topic for budget alerts
    const budgetAlertTopic = new sns.Topic(this, 'BudgetAlertTopic', {
      displayName: 'AWS Budget Alert Topic',
      topicName: 'table-tennis-budget-alerts',
    });

    // Add email subscription to SNS topic
    budgetAlertTopic.addSubscription(
      new subscriptions.EmailSubscription(props.email)
    );

    // Create Budget with alert
    new budgets.CfnBudget(this, 'MonthlyBudget', {
      budget: {
        budgetName: 'table-tennis-monthly-budget',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: {
          amount: props.budgetAmount,
          unit: props.currency,
        },
      },
      notificationsWithSubscribers: [
        {
          notification: {
            notificationType: 'ACTUAL',
            comparisonOperator: 'GREATER_THAN',
            threshold: 80,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [
            {
              subscriptionType: 'SNS',
              address: budgetAlertTopic.topicArn,
            },
          ],
        },
        {
          notification: {
            notificationType: 'ACTUAL',
            comparisonOperator: 'GREATER_THAN',
            threshold: 100,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [
            {
              subscriptionType: 'SNS',
              address: budgetAlertTopic.topicArn,
            },
          ],
        },
        {
          notification: {
            notificationType: 'FORECASTED',
            comparisonOperator: 'GREATER_THAN',
            threshold: 100,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [
            {
              subscriptionType: 'SNS',
              address: budgetAlertTopic.topicArn,
            },
          ],
        },
      ],
    });

    // CloudFormation Outputs
    new cdk.CfnOutput(this, 'BudgetAmount', {
      value: `${props.budgetAmount} ${props.currency}`,
      description: 'Monthly Budget Limit',
    });

    new cdk.CfnOutput(this, 'AlertEmail', {
      value: props.email,
      description: 'Email for budget alerts',
    });

    new cdk.CfnOutput(this, 'SNSTopicArn', {
      value: budgetAlertTopic.topicArn,
      description: 'SNS Topic ARN for budget alerts',
    });
  }
}
