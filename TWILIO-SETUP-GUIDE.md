# Twilio WhatsApp Setup Guide

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Twilio Account (5 mins)

1. Go to https://www.twilio.com/try-twilio
2. Sign up with your email
3. Verify your email and phone number
4. Complete the "Tell us about you" form

You'll get **$15 trial credit** - enough for ~1,700 WhatsApp messages!

---

### Step 2: Get WhatsApp Number (2 mins)

#### Option A: Sandbox (Instant - for testing)
```
1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Join sandbox by sending WhatsApp message to the number shown
3. Message format: "join <your-sandbox-code>"
4. ✅ Instantly ready for testing!
```

**Sandbox Number**: `+1 415 523 8886` (US number, works globally)

**Limitations**:
- Can only send to numbers that joined your sandbox
- Shows "Twilio Sandbox" in messages
- Not for production use

#### Option B: Production Number (2-24 hours - for production)
```
1. Go to: https://console.twilio.com/us1/develop/sms/whatsapp/senders
2. Click "Request to enable your Twilio number for WhatsApp"
3. Fill out the form (business details, use case)
4. Wait for approval (usually 2-24 hours for Indian businesses)
5. ✅ Production-ready WhatsApp number
```

---

### Step 3: Get Credentials (1 min)

1. Go to https://console.twilio.com/
2. Find your Account SID and Auth Token on the dashboard
3. Copy both values

Example:
```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token: your_auth_token_here
```

---

### Step 4: Create AWS Secret (2 mins)

```bash
# Create secret in AWS Secrets Manager
aws secretsmanager create-secret \
  --name twilio-whatsapp-credentials \
  --description "Twilio WhatsApp API credentials" \
  --secret-string '{
    "accountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "authToken": "your_auth_token_here",
    "whatsappNumber": "+14155238886"
  }' \
  --region ap-south-1

# Verify secret created
aws secretsmanager get-secret-value \
  --secret-id twilio-whatsapp-credentials \
  --region ap-south-1
```

**Note**: Replace values with your actual Twilio credentials

---

### Step 5: Test with Sandbox (5 mins)

#### Test Script
Create `test-twilio.js`:

```javascript
const twilio = require('twilio');

const accountSid = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const authToken = 'your_auth_token_here';
const client = twilio(accountSid, authToken);

async function testWhatsApp() {
  try {
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886', // Sandbox number
      to: 'whatsapp:+919999999999',   // Your WhatsApp number (must have joined sandbox)
      body: '🎉 Test message from Dream Sports! Your Twilio WhatsApp integration is working!'
    });
    
    console.log('✅ Message sent! SID:', message.sid);
    console.log('Status:', message.status);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWhatsApp();
```

Run:
```bash
cd lambda
npm install twilio
node test-twilio.js
```

Expected output:
```
✅ Message sent! SID: SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Status: queued
```

Check your WhatsApp - you should receive the message! 📱

---

## 📝 Message Templates

Twilio has **pre-approved templates** you can use immediately:

### 1. Order Confirmation
```
Your order {{1}} has been confirmed! 
Amount: {{2}}
Track: {{3}}
```

### 2. Shipment Update
```
Your order {{1}} has been shipped!
Tracking: {{2}}
Estimated delivery: {{3}}
```

### 3. Delivery Confirmation
```
Your order {{1}} has been delivered!
Thank you for shopping with us.
```

**Using templates:**
```typescript
await client.messages.create({
  from: 'whatsapp:+14155238886',
  to: 'whatsapp:+919999999999',
  contentSid: 'HXa1b2c3d4e5f6g7h8i9j0',  // Template SID from Twilio
  contentVariables: JSON.stringify({
    '1': 'ORDER-123',
    '2': '₹1500',
    '3': 'https://yourdomain.com/track/ORDER-123'
  })
});
```

---

## 💰 Pricing Calculator

### India Pricing
- **Template Messages** (business-initiated): $0.0088/message (~₹0.73)
- **Session Messages** (user-initiated): $0.004/message (~₹0.33)

### Your Cost Estimation

**Scenario: 10,000 orders/month**
```
Messages per order:
- Customer order confirmation: 1 message
- Seller notification: 1 message  
- Shipment created: 1 message
Total: 3 messages per order

Monthly messages: 10,000 × 3 = 30,000 messages
Monthly cost: 30,000 × $0.0088 = $264 (~₹22,000/month)
```

**Scenario: 1,000 orders/month**
```
Total messages: 1,000 × 3 = 3,000 messages
Monthly cost: 3,000 × $0.0088 = $26.40 (~₹2,200/month)
```

**Trial Credit**: $15 = ~1,700 messages (enough for 500+ test orders)

---

## 🔐 Security Best Practices

### 1. Never Hardcode Credentials
❌ Bad:
```typescript
const client = twilio('ACxxxx', 'hardcoded_token');
```

✅ Good:
```typescript
const credentials = await getTwilioCredentials(); // From Secrets Manager
const client = twilio(credentials.accountSid, credentials.authToken);
```

### 2. Use IAM Roles
Webhook Lambda needs:
```json
{
  "Effect": "Allow",
  "Action": "secretsmanager:GetSecretValue",
  "Resource": "arn:aws:secretsmanager:ap-south-1:*:secret:twilio-whatsapp-credentials-*"
}
```

### 3. Rotate Auth Tokens
```bash
# Rotate in Twilio Console
1. Go to https://console.twilio.com/us1/account/keys-credentials/auth-tokens
2. Click "Roll Auth Token"
3. Update AWS Secrets Manager with new token
```

---

## 🧪 Testing Checklist

### Pre-Deployment Tests

- [ ] **Sandbox Setup**
  ```bash
  # Join sandbox
  Send "join <code>" to +1 415 523 8886
  ```

- [ ] **Test Message Sending**
  ```bash
  cd lambda
  node test-twilio.js
  # Should receive message on WhatsApp
  ```

- [ ] **Test with AWS Secrets**
  ```bash
  # Verify secret exists
  aws secretsmanager get-secret-value \
    --secret-id twilio-whatsapp-credentials
  ```

- [ ] **Test Lambda Integration** (local)
  ```bash
  # Build Lambda
  cd lambda && npm run build
  
  # Test notification function
  ts-node -e "
    import { sendCustomerOrderConfirmation } from './notifications/twilio-whatsapp';
    sendCustomerOrderConfirmation({
      phone: '+919999999999',
      firstName: 'Test',
      orderId: 'TEST-123',
      orderAmount: 1500,
      orderItems: [{name: 'Test Product', quantity: 1}]
    }).then(console.log);
  "
  ```

### Production Tests

- [ ] **Production Number Approved**
- [ ] **Update whatsappNumber in Secrets Manager**
- [ ] **Test with real order**
- [ ] **Verify delivery status in Twilio Console**
- [ ] **Check CloudWatch logs**

---

## 📊 Monitoring

### Twilio Console Dashboards

1. **Message Logs**
   - https://console.twilio.com/us1/monitor/logs/sms
   - See all sent messages, delivery status, errors

2. **WhatsApp Insights**
   - https://console.twilio.com/us1/monitor/insights/whatsapp
   - Delivery rates, response times

3. **Usage Dashboard**
   - https://console.twilio.com/us1/billing/usage
   - Track message volume and costs

### CloudWatch Alerts

```typescript
// Add in CDK stack
const notificationErrorAlarm = new cloudwatch.Alarm(this, 'NotificationErrors', {
  metric: webhookFunction.metricErrors(),
  threshold: 5,
  evaluationPeriods: 1,
  alarmDescription: 'WhatsApp notification failures',
});
```

---

## 🐛 Troubleshooting

### Error: "To number is not a valid WhatsApp number"
**Solution**: Number must join sandbox first (for testing) or use approved production number

**Fix:**
```bash
# Sandbox: Send "join <code>" to sandbox number
# Production: Get number approved by Twilio
```

### Error: "Authentication failed"
**Solution**: Check Account SID and Auth Token

**Fix:**
```bash
# Verify credentials in AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id twilio-whatsapp-credentials

# Check Twilio Console for correct values
# https://console.twilio.com/
```

### Error: "Message blocked"
**Solution**: India requires specific message format

**Fix:**
```typescript
// Add business name and opt-out instructions
const message = `Your order #123 confirmed!
Amount: ₹1500

Reply STOP to unsubscribe

- Dream Sports Table Tennis`;
```

### Messages Not Delivered
**Check:**
1. Message status in Twilio Console
2. Phone number format (+91 prefix)
3. WhatsApp number is active
4. No rate limit exceeded

### High Costs
**Optimize:**
1. Use session messages (cheaper) when possible
2. Combine multiple updates into one message
3. Don't send duplicate messages (use idempotency)

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Production WhatsApp number approved
- [ ] Twilio credentials in AWS Secrets Manager
- [ ] IAM permissions granted to Lambda
- [ ] Environment variables set in CDK
- [ ] Lambda built and tested locally
- [ ] Monitoring and alerts configured

### Deployment Steps

```bash
# 1. Build Lambda functions
cd lambda
npm run build

# 2. Deploy CDK stack
cd ..
npm run cdk deploy

# 3. Test with real order
# Create order via frontend
# Verify WhatsApp messages received

# 4. Monitor CloudWatch logs
aws logs tail /aws/lambda/PaymentWebhookFunction --follow

# 5. Check Twilio message logs
# https://console.twilio.com/us1/monitor/logs/sms
```

### Post-Deployment Monitoring

**First 24 hours:**
- Check Twilio Console for delivery rates
- Monitor CloudWatch for errors
- Test 5-10 real orders
- Verify messages received by customers and sellers

**First week:**
- Track message costs vs estimates
- Monitor error rates
- Gather customer feedback
- Optimize message templates

---

## 💡 Tips & Best Practices

### 1. Message Content
- ✅ Keep messages under 160 characters when possible
- ✅ Use emojis for better engagement 🎉📦✅
- ✅ Include order tracking links
- ✅ Add opt-out instructions
- ❌ Avoid spam-like content
- ❌ Don't send too frequently

### 2. Error Handling
```typescript
// Always handle errors gracefully
try {
  await sendWhatsAppMessage(phone, message);
} catch (error) {
  console.error('WhatsApp failed:', error);
  // Fallback: Send SMS or email
  await sendFallbackNotification(phone, message);
}
```

### 3. Rate Limiting
- Twilio: 80 messages/second (business-initiated)
- Implement queuing for bulk messages
- Use exponential backoff for retries

### 4. Cost Optimization
- Cache Twilio client (Lambda container reuse)
- Use message templates (faster delivery)
- Combine updates when possible
- Don't resend messages on retry (use idempotency keys)

---

## 📞 Support

### Twilio Support
- **Console**: https://console.twilio.com/
- **Support**: https://support.twilio.com/
- **Documentation**: https://www.twilio.com/docs/whatsapp
- **Status**: https://status.twilio.com/

### Emergency Contact
For critical issues during business hours:
- Twilio Support: support@twilio.com
- Live Chat in Console (paid accounts)

---

## ✅ Success Criteria

You'll know it's working when:
1. ✅ Test message received on your WhatsApp
2. ✅ Order confirmation sent to customer after payment
3. ✅ Seller notification sent after order creation
4. ✅ Shipment notification sent with tracking number
5. ✅ Delivery status visible in Twilio Console
6. ✅ No errors in CloudWatch logs
7. ✅ Costs matching estimates

**Ready to go live!** 🚀
