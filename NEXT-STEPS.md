# Next Steps - Razorpay Integration

## ✅ Completed
- [x] Lambda functions deployed
- [x] API Gateway created
- [x] DynamoDB table imported
- [x] Frontend `.env.local` configured with API URL

## 🔧 Action Required

### 1. Configure Razorpay Webhook (5 minutes)

1. **Go to Razorpay Dashboard**: https://dashboard.razorpay.com/app/webhooks
2. **Click**: "Create New Webhook" or "Add Webhook URL"
3. **Webhook URL**: 
   ```
   https://uaxa274bh3.execute-api.ap-south-1.amazonaws.com/prod/payment/webhook
   ```
4. **Select Events**:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
5. **Webhook Secret**: Use the same value as your Razorpay API Secret (from `test_secret` in Secrets Manager)
6. **Click**: Save

### 2. Deploy Frontend to Amplify (2 minutes)

```bash
# Commit and push changes
git add .
git commit -m "Add Razorpay payment integration with API configuration"
git push origin shadCNTailwindUI
```

Amplify will automatically deploy the updated frontend with the new environment variable.

### 3. Test the Payment Flow (10 minutes)

Once Amplify deployment completes:

1. **Visit**: https://shadcntailwindui.d34u3bzjibnwqi.amplifyapp.com/checkout
2. **Add items** to cart and go to checkout
3. **Fill in** customer details
4. **Select**: "Online Payment (Razorpay)"
5. **Click**: "Proceed to Payment"
6. **Test Card Details**:
   - Card Number: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25` (any future date)
   - Name: `Test User`
7. **Complete payment**
8. **Verify**: Redirected to order success page with order ID

### 4. Verify Backend (5 minutes)

#### Check Lambda Logs:
```bash
# Create Order Lambda
aws logs tail /aws/lambda/TableTennisInfraStack-CreateOrderFunction --follow

# Webhook Lambda
aws logs tail /aws/lambda/TableTennisInfraStack-PaymentWebhookFunction --follow
```

#### Check DynamoDB:
```bash
# See all orders
aws dynamodb scan --table-name table-tennis-orders --max-items 10

# Query specific customer
aws dynamodb query \
  --table-name table-tennis-orders \
  --index-name CustomerOrdersIndex \
  --key-condition-expression "customerEmail = :email" \
  --expression-attribute-values '{":email":{"S":"your-test-email@example.com"}}'
```

## 📊 Deployment Information

**API Gateway URL**: https://uaxa274bh3.execute-api.ap-south-1.amazonaws.com/prod/
**Create Order Endpoint**: https://uaxa274bh3.execute-api.ap-south-1.amazonaws.com/prod/payment/create-order
**Webhook Endpoint**: https://uaxa274bh3.execute-api.ap-south-1.amazonaws.com/prod/payment/webhook
**Orders Table**: table-tennis-orders
**Website URL**: https://shadcntailwindui.d34u3bzjibnwqi.amplifyapp.com

## 🚨 Important Notes

1. **Test Mode**: Currently using `test_secret` with Razorpay test credentials
2. **Webhook Secret**: Must match your Razorpay API Secret key
3. **CORS**: Already configured to allow all origins for development
4. **Environment**: `.env.local` file created for Next.js frontend

## 🔍 Troubleshooting

### If payment fails:
1. Check browser console for errors
2. Verify `.env.local` file exists in `web-nextjs` directory
3. Check Lambda CloudWatch logs for errors
4. Verify Razorpay credentials in AWS Secrets Manager

### If webhook doesn't work:
1. Verify webhook URL in Razorpay dashboard
2. Check webhook Lambda CloudWatch logs
3. Ensure webhook secret matches API secret
4. Test webhook delivery from Razorpay dashboard

## 🎯 Quick Test Command

Once everything is set up, test the create-order endpoint directly:

```bash
curl -X POST https://uaxa274bh3.execute-api.ap-south-1.amazonaws.com/prod/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "INR",
    "receipt": "test_receipt_001",
    "notes": {
      "customerName": "Test User",
      "customerEmail": "test@example.com"
    }
  }'
```

Expected response should include `order_id` and `key_id`.

## 📝 Production Checklist (Before Going Live)

- [ ] Create production Razorpay credentials
- [ ] Create new secret `prod_razorpay_secret` in Secrets Manager
- [ ] Update Lambda environment variable to use production secret
- [ ] Redeploy CDK stack
- [ ] Update webhook URL in Razorpay production mode
- [ ] Test with real (non-test) card
- [ ] Set up CloudWatch alarms for errors
- [ ] Enable API Gateway throttling limits
- [ ] Review and tighten CORS policy

---

**Status**: 🟢 Ready for testing
**Last Updated**: ${new Date().toLocaleString()}
