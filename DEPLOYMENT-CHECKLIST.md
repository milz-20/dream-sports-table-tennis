# 🚀 Deployment Checklist - WhatsApp Notifications

## ✅ Code Implementation (COMPLETED)
- [x] Twilio WhatsApp service implemented
- [x] Notification helper for seller lookup
- [x] Webhook integration (customer + seller + shipment notifications)
- [x] CDK stack updated with Twilio config
- [x] Dependencies installed (twilio ^4.20.0)
- [x] Code committed and pushed

---

## 🔧 Pre-Deployment Setup

### 1. Twilio Account Setup
- [ ] Sign up at https://www.twilio.com/try-twilio
- [ ] Verify email and phone number
- [ ] Note your Account SID and Auth Token from dashboard

**Reference**: See `TWILIO-SETUP-GUIDE.md` Section "Step 1: Create Twilio Account"

---

### 2. Get WhatsApp Number

#### For Testing (Choose Option A)
- [ ] Go to Twilio Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
- [ ] Send "join <your-code>" to +1 415 523 8886 from your WhatsApp
- [ ] Verify you receive confirmation message
- [ ] Use sandbox number: `+14155238886`

#### For Production (Choose Option B)
- [ ] Request WhatsApp-enabled number in Twilio Console
- [ ] Submit business details and use case
- [ ] Wait for approval (2-24 hours)
- [ ] Note your production WhatsApp number

**Reference**: See `TWILIO-SETUP-GUIDE.md` Section "Step 2: Get WhatsApp Number"

---

### 3. Create AWS Secret
```bash
# Replace with your actual credentials
aws secretsmanager create-secret \
  --name twilio-whatsapp-credentials \
  --description "Twilio WhatsApp API credentials" \
  --secret-string '{
    "accountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "authToken": "your_auth_token_here",
    "whatsappNumber": "+14155238886"
  }' \
  --region ap-south-1
```

- [ ] Run command with your Twilio credentials
- [ ] Verify secret created:
```bash
aws secretsmanager get-secret-value \
  --secret-id twilio-whatsapp-credentials \
  --region ap-south-1
```

**Reference**: See `TWILIO-SETUP-GUIDE.md` Section "Step 4: Create AWS Secret"

---

### 4. Update Environment Variables

Edit `lib/table-tennis-stack.ts` if needed:

```typescript
TWILIO_SECRET_NAME: 'twilio-whatsapp-credentials', // ✅ Already set
APP_URL: 'https://yourdomain.com', // ⚠️ UPDATE THIS!
```

- [ ] Update `APP_URL` with your actual domain
- [ ] Commit and push changes if updated

---

### 5. Test Locally (Optional but Recommended)

Create `lambda/test-twilio.js`:
```javascript
const twilio = require('twilio');

const accountSid = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const authToken = 'your_auth_token_here';
const client = twilio(accountSid, authToken);

async function test() {
  const message = await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+919999999999', // Your number
    body: '🎉 Test from Dream Sports!'
  });
  console.log('✅ Sent:', message.sid);
}

test();
```

- [ ] Create test file
- [ ] Update with your phone number (must have joined sandbox)
- [ ] Run: `cd lambda && node test-twilio.js`
- [ ] Verify you receive WhatsApp message

**Reference**: See `TWILIO-SETUP-GUIDE.md` Section "Step 5: Test with Sandbox"

---

## 🏗️ Build & Deploy

### 6. Build Lambda Functions
```bash
cd lambda
npm run build
```

- [ ] Run build command
- [ ] Verify `dist/` directory created
- [ ] Check `dist/notifications/` exists with compiled files

**Expected output**:
```
> lambda@1.0.0 build
> tsc

# No errors = successful build
```

---

### 7. CDK Synth (Validation)
```bash
cd ..
npm run cdk synth
```

- [ ] Run synth command
- [ ] Review CloudFormation template for Twilio permissions
- [ ] Check for any errors

**What to look for**:
- `TWILIO_SECRET_NAME` environment variable in Lambda
- `secretsmanager:GetSecretValue` permission for `twilio-whatsapp-credentials-*`
- `APP_URL` environment variable

---

### 8. Deploy to AWS
```bash
npm run cdk deploy

# Or for specific stack:
cdk deploy TableTennisStack
```

- [ ] Run deploy command
- [ ] Confirm deployment when prompted
- [ ] Wait for completion (3-5 minutes)
- [ ] Note the output (API Gateway URL, etc.)

**Expected output**:
```
✅ TableTennisStack

Stack ARN:
arn:aws:cloudformation:ap-south-1:...

Outputs:
TableTennisStack.ApiEndpoint = https://xxxxx.execute-api.ap-south-1.amazonaws.com/prod
```

---

## 🧪 Post-Deployment Testing

### 9. Test Payment Webhook
```bash
# Trigger a test payment
# Method 1: Use Razorpay test mode
# Method 2: Create a real order via frontend
```

- [ ] Create a test order via your frontend
- [ ] Complete payment using Razorpay test card
- [ ] Verify webhook is called (check CloudWatch logs)

**Test Card Details** (Razorpay):
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

---

### 10. Verify Notifications Sent

**Check CloudWatch Logs**:
```bash
aws logs tail /aws/lambda/PaymentWebhookFunction --follow
```

- [ ] Look for "Customer notification sent: SMxxxxx"
- [ ] Look for "Seller notification sent: SMxxxxx"
- [ ] Look for "Shipment notification sent: SMxxxxx"
- [ ] No errors in logs

**Check Twilio Console**:
- [ ] Go to https://console.twilio.com/us1/monitor/logs/sms
- [ ] Verify messages show as "Delivered"
- [ ] Check customer received order confirmation
- [ ] Check seller(s) received order notification

**Reference**: See `TWILIO-SETUP-GUIDE.md` Section "Monitoring"

---

### 11. Verify Message Content

**Customer should receive**:
```
🎉 Order Confirmed!

Order ID: #ORDER-xxx
Amount: ₹1,500

Items:
• Blade X - Qty: 1

Track: https://yourdomain.com/track/ORDER-xxx

Thank you for shopping with us!
```

**Seller should receive**:
```
📦 New Order Alert!

Order: #ORDER-xxx
Customer: John Doe

Items for you:
• Blade X (₹1,500) - Qty: 1

Ship to:
John Doe
123 Main St, Mumbai - 400001
Phone: +91-9999999999

Total: ₹1,500

⚠️ Action Required: Prepare items for shipment
```

- [ ] Verify customer message format
- [ ] Verify seller message format
- [ ] Verify tracking links work

---

## 📊 Monitoring Setup

### 12. Configure CloudWatch Alarms

Add to `lib/table-tennis-stack.ts`:
```typescript
const notificationErrorAlarm = new cloudwatch.Alarm(this, 'NotificationErrors', {
  metric: webhookFunction.metricErrors(),
  threshold: 5,
  evaluationPeriods: 1,
  alarmDescription: 'WhatsApp notification failures',
});
```

- [ ] Add CloudWatch alarm for notification errors
- [ ] Set up SNS topic for alerts
- [ ] Test alarm triggers

---

### 13. Set Up Cost Monitoring

**Twilio Console**:
- [ ] Set usage alerts at https://console.twilio.com/us1/billing/usage
- [ ] Configure daily/monthly spending limits
- [ ] Set up email notifications for budget thresholds

**AWS Cost Explorer**:
- [ ] Set budget alert for Lambda executions
- [ ] Set budget alert for Secrets Manager reads
- [ ] Monitor CloudWatch Logs costs

---

## 🎯 Success Criteria

### All checks must pass:
- [ ] ✅ Test order completed successfully
- [ ] ✅ Payment webhook executed without errors
- [ ] ✅ Customer received order confirmation on WhatsApp
- [ ] ✅ Seller(s) received order notification on WhatsApp
- [ ] ✅ Messages delivered (verified in Twilio Console)
- [ ] ✅ Tracking links work correctly
- [ ] ✅ CloudWatch logs show no errors
- [ ] ✅ Costs match estimates (~₹0.73 per message)

---

## 🐛 Troubleshooting

### Issue: "To number is not a valid WhatsApp number"
**Solution**: For sandbox, the recipient must join by sending "join <code>" first

**Fix**:
```bash
# Have customer/seller join sandbox
Send "join your-sandbox-code" to +1 415 523 8886
```

---

### Issue: "Authentication failed"
**Solution**: Check AWS Secrets Manager credentials

**Fix**:
```bash
# Verify secret
aws secretsmanager get-secret-value --secret-id twilio-whatsapp-credentials

# Check Twilio Console
# https://console.twilio.com/ - verify Account SID and Auth Token
```

---

### Issue: Messages not delivered
**Check**:
1. Phone number format (needs +91 prefix for India)
2. WhatsApp number is active
3. Message status in Twilio Console
4. CloudWatch logs for errors

**Fix**:
```bash
# Check Lambda logs
aws logs tail /aws/lambda/PaymentWebhookFunction --follow

# Check Twilio message status
# https://console.twilio.com/us1/monitor/logs/sms
```

---

### Issue: High costs
**Solution**: Optimize message sending

**Fix**:
- Use session messages when possible (cheaper)
- Combine multiple updates into one message
- Implement idempotency to avoid duplicates
- Cache Twilio client in Lambda

---

## 📝 Next Steps After Successful Deployment

### Short Term (This Week)
- [ ] Test with 10-20 real orders
- [ ] Monitor delivery rates (should be >95%)
- [ ] Gather customer feedback on messages
- [ ] Optimize message templates based on feedback

### Medium Term (This Month)
- [ ] Upgrade to production WhatsApp number
- [ ] Implement Shiprocket webhook for delivery status
- [ ] Add "out for delivery" and "delivered" notifications
- [ ] Set up automated monthly cost reports

### Long Term (Next Quarter)
- [ ] Implement two-way messaging (customer replies)
- [ ] Add rich media support (images, PDFs)
- [ ] Create message templates for promotions
- [ ] A/B test message formats for engagement

---

## 📚 References

- **Twilio Setup Guide**: `TWILIO-SETUP-GUIDE.md`
- **WhatsApp API Comparison**: `WHATSAPP-API-COMPARISON.md`
- **Payment to Delivery Flow**: `PAYMENT-TO-DELIVERY-FLOW.md`
- **Integration Complete**: `INTEGRATION-COMPLETE.md`

---

## 🎉 Ready to Deploy!

If all pre-deployment checks are complete:
```bash
cd lambda && npm run build
cd .. && npm run cdk deploy
```

**Good luck! 🚀**
