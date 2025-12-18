# GitHub Actions Setup for AWS CDK Deployment

This document explains how to set up GitHub Actions to automatically deploy your CDK infrastructure.

## Overview

The GitHub Actions workflow automatically deploys CDK stacks when:
- Code is pushed to the `main` branch
- Changes are made to infrastructure files (`lib/`, `bin/`, `cdk.json`)
- Manually triggered via GitHub UI

## Setup Instructions

### 1. Create IAM OIDC Identity Provider (One-time setup)

Run this in your AWS account (as admin):

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### 2. Create IAM Role for GitHub Actions

Create a file `github-actions-role.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:milz-20/dream-sports-table-tennis:*"
        }
      }
    }
  ]
}
```

Create the role:

```bash
# Replace YOUR_ACCOUNT_ID with your AWS account ID
aws iam create-role \
  --role-name GitHubActionsCDKDeployRole \
  --assume-role-policy-document file://github-actions-role.json

# Attach administrator access for CDK deployments
aws iam attach-role-policy \
  --role-name GitHubActionsCDKDeployRole \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

**Note:** For production, create a custom policy with minimal permissions instead of AdministratorAccess.

### 3. Add GitHub Secret

1. Go to your GitHub repository: `https://github.com/milz-20/dream-sports-table-tennis`
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add secret:
   - Name: `AWS_ROLE_ARN`
   - Value: `arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsCDKDeployRole`

### 4. Configure Branch Protection

Protect your main branch:

1. Go to: **Settings → Branches**
2. Click **Add rule**
3. Configure:
   - Branch name pattern: `main`
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings (for admins too, optional)

## Workflow Details

### Triggers
- **Push to main**: Automatic deployment
- **Manual**: Via "Actions" tab → "Deploy CDK Infrastructure" → "Run workflow"

### What it does
1. Checks out your code
2. Sets up Node.js and installs dependencies
3. Authenticates to AWS using OIDC (no static credentials!)
4. Builds the CDK app
5. Shows diff of changes
6. Deploys all stacks

### Security Benefits
- ✅ No AWS access keys stored in GitHub
- ✅ Only CI/CD can deploy (not developers)
- ✅ All changes go through pull requests
- ✅ Audit trail in GitHub Actions logs
- ✅ Temporary credentials only (OIDC)

## Developer Workflow

1. Developer creates feature branch: `git checkout -b feature/new-lambda`
2. Makes changes to code
3. Commits and pushes: `git push origin feature/new-lambda`
4. Creates Pull Request on GitHub
5. **You review and approve**
6. Merge to main
7. GitHub Actions automatically deploys to AWS

## Manual Deployment (Emergency)

If you need to deploy manually:

1. Go to **Actions** tab in GitHub
2. Select "Deploy CDK Infrastructure"
3. Click "Run workflow"
4. Choose branch (usually `main`)
5. Click "Run workflow" button

## Monitoring Deployments

- View logs: **Actions** tab → Select workflow run
- Check status: Green ✅ = Success, Red ❌ = Failed
- Get notified: **Settings → Notifications** to get emails

## Rollback

If a deployment fails or causes issues:

1. Revert the commit in GitHub
2. The workflow will automatically deploy the previous version
3. Or manually run the workflow from a previous commit

## Troubleshooting

### "Role cannot be assumed"
- Verify the OIDC provider is created
- Check the trust policy matches your repository
- Ensure the role ARN is correct in GitHub secrets

### "Access Denied" during deployment
- The GitHub Actions role needs sufficient permissions
- Check CloudFormation, Lambda, DynamoDB, S3 permissions

### Workflow doesn't trigger
- Ensure changes are in the paths specified (`lib/`, `bin/`, etc.)
- Check branch name is `main`
- Verify workflow file is in `.github/workflows/`

## Cost Savings

By using GitHub Actions:
- Free for public repos
- 2,000 minutes/month free for private repos
- Only runs when code changes
- No need for EC2 instances for CI/CD
