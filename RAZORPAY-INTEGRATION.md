# Razorpay Payment Integration Guide

## Overview
This guide walks through the complete Razorpay payment integration with webhook support for the Dream Sports Table Tennis application.

## Architecture

### Components
1. **Frontend (Next.js)**: Checkout page with Razorpay integration
2. **Backend (AWS Lambda)**: 
   - Create Order Lambda: Creates Razorpay orders
   - Webhook Lambda: Verifies and processes payment webhooks
3. **API Gateway**: REST API endpoints for payment operations
4. **AWS Secrets Manager**: Stores Razorpay API credentials
5. **DynamoDB**: Stores order information
6. **Razorpay**: Payment gateway service

### Flow
```
User clicks Pay → Frontend calls create-order API → Lambda creates Razorpay order 
→ Razorpay checkout opens → User completes payment → Razorpay sends webhook 
→ Webhook Lambda verifies signature → Saves order to DynamoDB → Success page
```

## Prerequisites

1. **Razorpay Account**
   - Sign up at https://razorpay.com
   - Get Test API Key and Secret from Dashboard → Settings → API Keys

2. **AWS Secrets Manager**
   - Secret name: `test_secret` (already created as per user)
   - Secret keys:
     - `api:key`: Your Razorpay Test Key ID
     - `api:secret`: Your Razorpay Test Secret Key

## Deployment Steps

### Step 1: Install Lambda Dependencies

```bash
cd lambda
npm install
cd ..
```

### Step 2: Update CDK Stack

The stack has been updated with:
- DynamoDB Orders table
- Lambda functions for payment processing
- API Gateway with CORS support
- Proper IAM permissions

### Step 3: Deploy Infrastructure

```bash
# Build the CDK project
npm run build

# Deploy the stack
cdk deploy TableTennisInfraStack
```

After deployment, note the outputs:
- `PaymentApiUrl`: Your API Gateway URL
- `CreateOrderEndpoint`: Endpoint for creating orders
- `WebhookEndpoint`: Endpoint for Razorpay webhooks
- `OrdersTableName`: DynamoDB table name

### Step 4: Configure Razorpay Webhook

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Click "Add New Webhook"
3. Enter the `WebhookEndpoint` URL from CDK outputs
4. Select events to listen:
   - ✅ payment.captured
   - ✅ payment.failed
5. Set webhook secret (this will be the same as your API secret)
6. Save the webhook

### Step 5: Configure Frontend

1. Create `.env.local` file in `web-nextjs` directory:

```bash
cd web-nextjs
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your API Gateway URL:

```env
NEXT_PUBLIC_PAYMENT_API_URL=https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/prod
```

Replace `YOUR_API_ID` with the actual API ID from the CDK outputs.

### Step 6: Deploy Frontend

The frontend will be automatically deployed via Amplify when you push to GitHub.

```bash
git add .
git commit -m "Add Razorpay payment integration with webhook support"
git push origin shadCNTailwindUI
```

## Testing

### Test Payment Flow

1. Navigate to the checkout page
2. Fill in customer details
3. Select "Online Payment (Razorpay)"
4. Click "Proceed to Payment"
5. Use Razorpay test card details:
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

### Verify Webhook

1. Check CloudWatch Logs for the webhook Lambda function:
   ```bash
   aws logs tail /aws/lambda/TableTennisInfraStack-PaymentWebhookFunction --follow
   ```

2. Verify order in DynamoDB:
   ```bash
   aws dynamodb scan --table-name table-tennis-orders
   ```

## Security Features

### Implemented
- ✅ Razorpay credentials stored in AWS Secrets Manager
- ✅ Webhook signature verification
- ✅ HTTPS-only API endpoints
- ✅ CORS configuration for frontend access
- ✅ IAM permissions for least privilege access
- ✅ Payment data encrypted in transit and at rest

### Webhook Verification
The webhook Lambda verifies every incoming webhook using HMAC-SHA256 signature verification. This ensures that only legitimate webhooks from Razorpay are processed.

## Monitoring

### CloudWatch Logs
Monitor Lambda function logs:
```bash
# Create Order Lambda
aws logs tail /aws/lambda/TableTennisInfraStack-CreateOrderFunction --follow

# Webhook Lambda
aws logs tail /aws/lambda/TableTennisInfraStack-PaymentWebhookFunction --follow
```

### DynamoDB Queries

Get recent orders:
```bash
aws dynamodb query \
  --table-name table-tennis-orders \
  --index-name StatusIndex \
  --key-condition-expression "status = :status" \
  --expression-attribute-values '{":status":{"S":"paid"}}' \
  --scan-index-forward false \
  --limit 10
```

Get customer orders:
```bash
aws dynamodb query \
  --table-name table-tennis-orders \
  --index-name CustomerOrdersIndex \
  --key-condition-expression "customerEmail = :email" \
  --expression-attribute-values '{":email":{"S":"customer@example.com"}}'
```

## Troubleshooting

### Issue: "Failed to load Razorpay SDK"
**Solution**: Check internet connectivity and firewall settings. The Razorpay script loads from `https://checkout.razorpay.com/v1/checkout.js`.

### Issue: "Failed to create order"
**Solutions**:
1. Verify API Gateway URL in `.env.local`
2. Check Lambda CloudWatch logs for errors
3. Verify Secrets Manager contains correct credentials
4. Ensure Lambda has permissions to access Secrets Manager

### Issue: "Webhook not receiving events"
**Solutions**:
1. Verify webhook URL in Razorpay dashboard
2. Check that webhook Lambda has permissions to write to DynamoDB
3. Review CloudWatch logs for webhook Lambda
4. Ensure API Gateway endpoint is publicly accessible

### Issue: "Invalid signature" error in webhook
**Solutions**:
1. Verify the webhook secret in Razorpay matches the API secret
2. Check that the secret in AWS Secrets Manager is correct
3. Review the signature verification code in webhook Lambda

## Production Deployment

### Before Going Live

1. **Update to Production Credentials**
   - Create a new secret (e.g., `prod_razorpay_secret`)
   - Add production API key and secret
   - Update Lambda environment variables

2. **Update Stack**
   ```typescript
   environment: {
     RAZORPAY_SECRET_NAME: 'prod_razorpay_secret',
   }
   ```

3. **Enable Additional Security**
   - Enable AWS WAF on API Gateway
   - Set up CloudWatch alarms for failed payments
   - Configure API throttling limits
   - Enable DynamoDB point-in-time recovery (already enabled)

4. **Update Razorpay Dashboard**
   - Switch to Live mode
   - Update webhook URL
   - Enable additional security features

## Cost Estimation

### AWS Resources
- **Lambda**: ~$0.20 per 1 million requests
- **API Gateway**: ~$3.50 per 1 million requests
- **DynamoDB**: Pay-per-request pricing (~$1.25 per million writes)
- **Secrets Manager**: $0.40 per secret per month

### Razorpay Fees
- 2% per transaction (for domestic cards)
- Check Razorpay pricing for current rates

## Support

For issues or questions:
1. Check CloudWatch Logs
2. Review Razorpay Dashboard → Payments
3. Contact Razorpay support: support@razorpay.com

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Webhooks Guide](https://razorpay.com/docs/webhooks/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
