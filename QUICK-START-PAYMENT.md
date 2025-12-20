# Quick Start Guide - Razorpay Integration

## What Was Done

✅ **Created Lambda Functions**
- `lambda/create-order.ts`: Creates Razorpay orders with customer details
- `lambda/verify-payment.ts`: Webhook handler that verifies payments and saves to DynamoDB

✅ **Updated CDK Infrastructure**
- Added DynamoDB Orders table with GSIs for customer lookup and status filtering
- Created Lambda functions with proper IAM permissions
- Set up API Gateway with CORS support
- Configured Lambda to access Secrets Manager for Razorpay credentials

✅ **Updated Frontend**
- Modified checkout page to support online payments via Razorpay
- Added Razorpay SDK integration with payment modal
- Updated order success page to display order ID and payment ID
- Changed default payment method to online payment

✅ **Security Features**
- Webhook signature verification using HMAC-SHA256
- Razorpay credentials stored in AWS Secrets Manager
- Proper IAM least-privilege permissions
- CORS configuration for secure API access

## Next Steps

### 1. Deploy the Infrastructure (10 minutes)

```bash
cd c:\git\dream-sports-table-tennis
npm run build
cdk deploy TableTennisInfraStack
```

**Important**: Save the following outputs from deployment:
- `PaymentApiUrl`
- `WebhookEndpoint`

### 2. Configure Razorpay Webhook (5 minutes)

1. Go to https://dashboard.razorpay.com/app/webhooks
2. Click "Create New Webhook"
3. Paste the `WebhookEndpoint` URL from CDK output
4. Select events: `payment.captured`, `payment.failed`
5. The webhook secret should match your Razorpay API secret
6. Save

### 3. Configure Frontend Environment (2 minutes)

```bash
cd web-nextjs
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_PAYMENT_API_URL=<paste PaymentApiUrl from CDK output here>
```

### 4. Deploy Frontend (Automatic)

Push to GitHub - Amplify will auto-deploy:
```bash
git add .
git commit -m "Add Razorpay payment integration"
git push origin shadCNTailwindUI
```

## Testing Payment (5 minutes)

1. Visit your website checkout page
2. Fill in customer details
3. Select "Online Payment (Razorpay)"
4. Click "Proceed to Payment"
5. Use test card: `4111 1111 1111 1111`, any CVV, any future expiry
6. Complete payment
7. Verify order appears in DynamoDB table `table-tennis-orders`

## Monitoring

**View Lambda logs:**
```bash
# Create Order logs
aws logs tail /aws/lambda/TableTennisInfraStack-CreateOrderFunction --follow

# Webhook logs
aws logs tail /aws/lambda/TableTennisInfraStack-PaymentWebhookFunction --follow
```

**Check orders in DynamoDB:**
```bash
aws dynamodb scan --table-name table-tennis-orders
```

## Important Notes

⚠️ **Current Setup**: Test mode (uses test_secret from Secrets Manager)

🔐 **Production**: Update to production credentials before going live:
1. Create new secret with production API keys
2. Update Lambda environment variable `RAZORPAY_SECRET_NAME`
3. Redeploy stack
4. Update Razorpay webhook URL to production endpoint

📊 **Order Flow**:
```
Customer → Checkout → Create Order API → Razorpay → Payment → Webhook → DynamoDB
```

## Troubleshooting

**"Failed to create order"**
→ Check CloudWatch logs for the CreateOrderFunction
→ Verify test_secret exists in Secrets Manager with correct keys

**"Webhook not working"**
→ Verify webhook URL in Razorpay dashboard
→ Check CloudWatch logs for PaymentWebhookFunction
→ Ensure secret matches between Razorpay and Secrets Manager

**"Payment successful but order not saved"**
→ Check webhook Lambda has permissions to write to DynamoDB
→ Review CloudWatch logs for errors
→ Verify webhook signature verification is passing

## Files Modified

- `lib/table-tennis-stack.ts` - Added payment infrastructure
- `web-nextjs/src/app/checkout/CheckoutClient.tsx` - Added Razorpay integration
- `web-nextjs/src/app/order-success/OrderSuccessClient.tsx` - Display payment details
- `lambda/create-order.ts` - Order creation Lambda
- `lambda/verify-payment.ts` - Webhook handler Lambda

## Documentation

See `RAZORPAY-INTEGRATION.md` for comprehensive documentation including:
- Architecture details
- Security features
- Production deployment checklist
- Cost estimation
- Additional troubleshooting tips
