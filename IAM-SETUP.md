# IAM Developer Setup - Deployment Guide

This CDK stack creates IAM users and permissions for your backend developers.

## What This Stack Creates

1. **IAM Group**: `BackendDevelopers` with permissions for:
   - AWS Lambda (Full Access)
   - DynamoDB (Full Access)
   - API Gateway (Full Access)
   - S3 (Full Access)
   - CloudWatch Logs (Full Access)
   - CloudFormation (for CDK deployments)
   - Amplify (Read-only)

2. **IAM Users**: 
   - `dev-developer1`
   - `dev-developer2`

3. **Security Restrictions**:
   - ❌ No billing access
   - ❌ No IAM privilege escalation
   - ❌ No account modifications
   - ✅ Password reset required on first login

4. **Access Keys**: For AWS CLI/CDK usage

## Deployment Steps

### 1. Deploy the Stack

```bash
# From the root directory
cdk deploy IamDevelopersStack
```

### 2. Note the Outputs

After deployment, you'll see outputs like:
```
IamDevelopersStack.Developer1Username = dev-developer1
IamDevelopersStack.Developer1AccessKeyId = AKIA...
IamDevelopersStack.Developer1SecretAccessKey = xyz123... (SAVE THIS!)
IamDevelopersStack.Developer2Username = dev-developer2
IamDevelopersStack.Developer2AccessKeyId = AKIA...
IamDevelopersStack.Developer2SecretAccessKey = abc456... (SAVE THIS!)
IamDevelopersStack.AccountId = 123456789012
IamDevelopersStack.ConsoleUrl = https://123456789012.signin.aws.amazon.com/console
```

**⚠️ IMPORTANT**: Save the Secret Access Keys immediately - they won't be shown again!

### 3. Share Credentials with Developers

Send each developer:

#### For Console Access:
- Console URL: `https://YOUR-ACCOUNT-ID.signin.aws.amazon.com/console`
- Username: `dev-developer1` or `dev-developer2`
- Temporary Password: `ChangeMe123!` or `ChangeMe456!`
- Instructions: Change password on first login

#### For CLI/CDK Access:
```bash
# Developer should configure AWS CLI
aws configure
# Enter Access Key ID
# Enter Secret Access Key
# Region: ap-south-1
# Output format: json
```

Or create `~/.aws/credentials` file:
```ini
[default]
aws_access_key_id = AKIA...
aws_secret_access_key = xyz123...
region = ap-south-1
```

### 4. Enable MFA (Highly Recommended)

After developers log in:
1. Click username (top-right) → **Security credentials**
2. Click **Assign MFA device**
3. Choose **Virtual MFA device**
4. Scan QR code with Google Authenticator / Authy
5. Enter two consecutive MFA codes

### 5. Test Access

Developer should test:
```bash
# Verify credentials
aws sts get-caller-identity

# Should see their username
{
  "UserId": "AIDAI...",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/dev-developer1"
}
```

## Customization

### Add More Developers

Edit `lib/iam-developers-stack.ts`:

```typescript
const developer3 = new iam.User(this, 'Developer3', {
  userName: 'dev-developer3',
  password: cdk.SecretValue.unsafePlainText('ChangeMe789!'),
  passwordResetRequired: true,
});

developer3.addToGroup(backendDevsGroup);

const dev3AccessKey = new iam.CfnAccessKey(this, 'Developer3AccessKey', {
  userName: developer3.userName,
});

// Add outputs for developer3...
```

Then redeploy:
```bash
cdk deploy IamDevelopersStack
```

### Modify Permissions

Edit the policies in `lib/iam-developers-stack.ts` and redeploy.

### Remove a Developer

```bash
# Option 1: Delete from AWS Console
# IAM → Users → Select user → Delete

# Option 2: Remove from CDK code and redeploy
# Comment out or remove the user code, then:
cdk deploy IamDevelopersStack
```

## Security Best Practices

1. ✅ **Enable MFA** on all accounts (especially yours)
2. ✅ **Rotate access keys** every 90 days
3. ✅ **Review CloudTrail logs** monthly
4. ✅ **Use least privilege** - only grant needed permissions
5. ✅ **Remove access** when developers leave
6. ✅ **Monitor costs** with budget alerts

## Troubleshooting

### Developer can't deploy CDK
- Ensure they have CloudFormation permissions (included in stack)
- Check they're in the correct region (ap-south-1)
- Verify CDK is bootstrapped: `cdk bootstrap`

### Access Denied errors
- Check the user is in the BackendDevelopers group
- Review CloudTrail logs to see what action was denied
- May need to add additional permissions to the group

### Forgotten Password
As admin, reset in AWS Console:
1. IAM → Users → Select user
2. Security credentials → Manage console password
3. Click "Enable" or "Reset password"

## Cost

IAM users and groups are **FREE**. No additional cost for this stack.

## Cleanup

To remove all IAM resources:
```bash
cdk destroy IamDevelopersStack
```

**⚠️ Warning**: This will delete all users and their access keys!
