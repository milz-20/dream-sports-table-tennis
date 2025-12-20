import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IamDevelopersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create IAM Group for Backend Developers
    const backendDevsGroup = new iam.Group(this, 'BackendDevelopers', {
      groupName: 'BackendDevelopers',
    });

    // Attach Managed Policies for Backend Development
    backendDevsGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess')
    );
    backendDevsGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
    );
    backendDevsGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayAdministrator')
    );
    backendDevsGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
    );
    backendDevsGroup.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess')
    );

    // Read-only Policy for CloudFormation/CDK (no deployment permissions)
    const readOnlyInfraPolicy = new iam.Policy(this, 'ReadOnlyInfraPolicy', {
      policyName: 'ReadOnlyInfraPolicy',
      statements: [
        // CloudFormation READ-ONLY permissions
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'cloudformation:DescribeStacks',
            'cloudformation:DescribeStackEvents',
            'cloudformation:DescribeStackResources',
            'cloudformation:GetTemplate',
            'cloudformation:ListStacks',
            'cloudformation:ListStackResources',
          ],
          resources: ['*'],
        }),
        // S3 READ-ONLY for CDK Bootstrap bucket
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            's3:GetObject',
            's3:ListBucket',
          ],
          resources: [
            'arn:aws:s3:::cdk-*',
            'arn:aws:s3:::cdk-*/*',
          ],
        }),
        // SSM READ-ONLY for CDK Context
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'ssm:GetParameter',
            'ssm:GetParameters',
          ],
          resources: ['*'],
        }),
        // Read-only Amplify access
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'amplify:GetApp',
            'amplify:GetBranch',
            'amplify:ListApps',
            'amplify:ListBranches',
          ],
          resources: ['*'],
        }),
      ],
    });

    backendDevsGroup.attachInlinePolicy(readOnlyInfraPolicy);

    // Allow users to manage their own credentials
    const selfManagePolicy = new iam.Policy(this, 'SelfManageCredentials', {
      policyName: 'SelfManageCredentials',
      statements: [
        // Allow users to change their own password
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:ChangePassword',
            'iam:GetUser',
          ],
          resources: ['arn:aws:iam::*:user/${aws:username}'],
        }),
        // Allow users to manage their own MFA
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:CreateVirtualMFADevice',
            'iam:DeleteVirtualMFADevice',
            'iam:EnableMFADevice',
            'iam:ResyncMFADevice',
            'iam:DeactivateMFADevice',
          ],
          resources: [
            'arn:aws:iam::*:user/${aws:username}',
            'arn:aws:iam::*:mfa/${aws:username}',
          ],
        }),
        // Allow users to list their own MFA devices
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:ListMFADevices',
            'iam:ListVirtualMFADevices',
            'iam:ListUsers',
          ],
          resources: ['*'],
        }),
        // Allow users to manage their own access keys
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:CreateAccessKey',
            'iam:DeleteAccessKey',
            'iam:ListAccessKeys',
            'iam:UpdateAccessKey',
          ],
          resources: ['arn:aws:iam::*:user/${aws:username}'],
        }),
      ],
    });

    backendDevsGroup.attachInlinePolicy(selfManagePolicy);

    // Deny dangerous actions and infrastructure changes
    const denyPolicy = new iam.Policy(this, 'DenyDangerousActions', {
      policyName: 'DenyDangerousActions',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          actions: [
            // Prevent billing access
            'aws-portal:*',
            'budgets:*',
            'ce:*',
            'cur:*',
            // Prevent IAM privilege escalation
            'iam:CreateUser',
            'iam:CreateGroup',
            'iam:CreateRole',
            'iam:AttachUserPolicy',
            'iam:AttachGroupPolicy',
            'iam:AttachRolePolicy',
            'iam:PutUserPolicy',
            'iam:PutGroupPolicy',
            'iam:PutRolePolicy',
            'iam:DeleteUser',
            'iam:DeleteGroup',
            'iam:DeleteRole',
            'iam:UpdateAssumeRolePolicy',
            // Prevent account modifications
            'organizations:*',
            'account:*',
            // Prevent CloudFormation/CDK deployments
            'cloudformation:CreateStack',
            'cloudformation:UpdateStack',
            'cloudformation:DeleteStack',
            'cloudformation:CreateChangeSet',
            'cloudformation:ExecuteChangeSet',
            // Prevent infrastructure modifications
            'amplify:CreateApp',
            'amplify:DeleteApp',
            'amplify:UpdateApp',
            'amplify:CreateBranch',
            'amplify:DeleteBranch',
            'amplify:UpdateBranch',
            'route53:CreateHostedZone',
            'route53:DeleteHostedZone',
            'route53:ChangeResourceRecordSets',
          ],
          resources: ['*'],
        }),
      ],
    });

    backendDevsGroup.attachInlinePolicy(denyPolicy);

    // Create IAM Users for Developers
    const developer1 = new iam.User(this, 'dev-sarv', {
      userName: 'dev-sarv',
      password: cdk.SecretValue.unsafePlainText('TempPass123!@#Sarv'), // Change after first login
      passwordResetRequired: true,
    });

    const developer2 = new iam.User(this, 'dev-pat', {
      userName: 'dev-pat',
      password: cdk.SecretValue.unsafePlainText('TempPass456!@#Pat'), // Change after first login
      passwordResetRequired: true,
    });

    const developer3 = new iam.User(this, 'dev-hari', {
      userName: 'dev-hari',
      password: cdk.SecretValue.unsafePlainText('TempPass789!@#Hari'), // Change after first login
      passwordResetRequired: true,
    });

    const developer4 = new iam.User(this, 'dev-shub', {
      userName: 'dev-shub',
      password: cdk.SecretValue.unsafePlainText('TempPass789!@#Shub'), // Change after first login
      passwordResetRequired: true,
    });


    // Add users to the group
    developer1.addToGroup(backendDevsGroup);
    developer2.addToGroup(backendDevsGroup);
    developer3.addToGroup(backendDevsGroup);
    developer4.addToGroup(backendDevsGroup);

    // Create access keys for CLI/CDK usage
    const dev1AccessKey = new iam.CfnAccessKey(this, 'Developer1AccessKey', {
      userName: developer1.userName,
    });

    const dev2AccessKey = new iam.CfnAccessKey(this, 'Developer2AccessKey', {
      userName: developer2.userName,
    });

    // Outputs
    new cdk.CfnOutput(this, 'Developer1Username', {
      value: developer1.userName,
      description: 'Username for Developer 1',
    });

    new cdk.CfnOutput(this, 'Developer1AccessKeyId', {
      value: dev1AccessKey.ref,
      description: 'Access Key ID for Developer 1',
    });

    new cdk.CfnOutput(this, 'Developer1SecretAccessKey', {
      value: dev1AccessKey.attrSecretAccessKey,
      description: 'Secret Access Key for Developer 1 (Store securely!)',
    });

    new cdk.CfnOutput(this, 'Developer2Username', {
      value: developer2.userName,
      description: 'Username for Developer 2',
    });

    new cdk.CfnOutput(this, 'Developer2AccessKeyId', {
      value: dev2AccessKey.ref,
      description: 'Access Key ID for Developer 2',
    });

    new cdk.CfnOutput(this, 'Developer2SecretAccessKey', {
      value: dev2AccessKey.attrSecretAccessKey,
      description: 'Secret Access Key for Developer 2 (Store securely!)',
    });

    new cdk.CfnOutput(this, 'AccountId', {
      value: this.account,
      description: 'AWS Account ID',
    });

    new cdk.CfnOutput(this, 'ConsoleUrl', {
      value: `https://${this.account}.signin.aws.amazon.com/console`,
      description: 'AWS Console Login URL',
    });

    new cdk.CfnOutput(this, 'BackendDevsGroupName', {
      value: backendDevsGroup.groupName,
      description: 'IAM Group name for Backend Developers',
    });
  }
}
