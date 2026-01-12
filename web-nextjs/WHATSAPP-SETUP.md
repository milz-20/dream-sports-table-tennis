# SMS Order Notifications Setup (AWS SNS)

This guide will help you set up automatic SMS notifications for new orders using AWS SNS.

## Prerequisites

- AWS Account with appropriate permissions
- A phone number to receive SMS notifications
- AWS CLI configured (optional, for local testing)

## Step 1: Enable SMS in AWS SNS

1. Go to [AWS SNS Console](https://console.aws.amazon.com/sns/)
2. Select your region (e.g., `ap-south-1` for India)
3. Click on **Text messaging (SMS)** in the left sidebar
4. Click **Publish text message** to verify SMS is enabled

## Step 2: Set Up SNS Spending Limit (Optional but Recommended)

1. In SNS Console → **Text messaging (SMS)** → **Text messaging preferences**
2. Set **Account spend limit** (e.g., $10/month to prevent unexpected charges)
3. Set **Default message type** to **Transactional** (for order notifications)

## Step 3: Configure IAM Permissions for Amplify

Your Amplify app needs permission to send SMS via SNS. Add this policy to your Amplify service role:

## Step 4: Configure Environment Variables

1. In the `web-nextjs` folder, create a file named `.env.local`
2. Copy the contents from `.env.local.example`
3. Fill in your Twilio credentials:

```env
YOUR_PHONE_NUMBER=+919325173787
AWS_REGION=ap-south-1

# For local testing, also add AWS credentials:
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Important Notes:**
- Include country code with `+` (e.g., `+91` for India, `+1` for US)
- No spaces in the phone number
- For production (Amplify), AWS credentials are auto-provided via IAM role
      ],
      "Resource": "*"
    }
  ]
}
```

**To add this policy:**
1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Find your Amplify service role (usually named like `amplify-<app-name>-<env>-<id>`)
3. Click **Add permissions** → **Create inline policy**
4. Choose JSON tab and paste the above policy
5. Name it `SNSPublishPolicy` and save

## Step 4: Configure Environment Variables in Amplify

1. Go to [Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app → **Environment variables**
3. Add the following variable:

```
YOUR_PHONE_NUMBER = +919325173787
```

Replace with your actual phone number (include country code with `+`)

**For local development**, create `.env.local` file:Twilio sandbox number
- Replace `+919325173787` with YOUR phone number (the one you used to join the sandbox)
- Always include the `whatsapp:` prefix
- Include the country code with `+` (e.g., `+91` for India, `+1` for US)
## Step 5: Test the Integration

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Place a test order:**
   - Add items to cart
   - Go to checkout
   - Fill in customer details
   - Complete the order (either COD or online payment)

3. **Check your phone:**
   - You should receive an SMS with order details
   - Message format includes:
     - Order ID
     - Customer name and phone
     - Items ordered
     - Total amount
     - Payment method
     - Delivery city and pincode

## Cost Information

**AWS SNS SMS Pricing (India - ap-south-1):**
- Transactional SMS: ~₹0.53 per message (~$0.00645 USD)
- First 100 SMS/month may be included in AWS Free Tier (check current offerings)
- Multi-part messages: Each 160 characters = 1 message unit

**Example Monthly Cost:**
- 50 orders/month = ₹26.50 (~$0.32)
- 200 orders/month = ₹106 (~$1.29)

Compare to Twilio WhatsApp: Free after setup

## Message Format
## Troubleshooting

### "Phone number not configured" error
- Check that `YOUR_PHONE_NUMBER` is set in Amplify environment variables
- For local dev, check `.env.local` file exists with the variable
- Restart your development server after adding environment variables

### Not receiving SMS
- Verify your phone number is correct with country code (+91 for India)
- Check AWS SNS Console → Text messaging → Delivery status logs
- Ensure your phone number is not on the SNS opt-out list
- Check IAM permissions for Amplify service role

### SMS delivery failed
- Check CloudWatch Logs for detailed error messages
- Verify SNS has permission to send SMS in your AWS region
- Some regions don't support SMS - use ap-south-1 for India
- Check if your AWS account is in sandbox mode (limits apply)

### Local testing not working
- Ensure AWS credentials are configured (`aws configure`)
- Or set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env.local`
- Verify IAM user has `sns:Publish` permission
• Butterfly Tenergy 05 - Red x1 - ₹5,500
• Xiom FT IGRE 2 - White (Size 9) x1 - ₹8,999

💰 Total: ₹14,499
Payment: Online Payment
Payment ID: pay_1234567890
```

## Next Steps

Once testing is complete and you're ready for production:
1. Apply for WhatsApp Business API approval
2. Set up message templates (required for business-initiated messages)
3. Configure webhooks for two-way communication
4. Add delivery status tracking

## Support

- Twilio Documentation: [https://www.twilio.com/docs/whatsapp](https://www.twilio.com/docs/whatsapp)
- Twilio Support: [https://support.twilio.com](https://support.twilio.com)
## Support

- AWS SNS Documentation: [https://docs.aws.amazon.com/sns/](https://docs.aws.amazon.com/sns/)
- AWS SNS SMS Pricing: [https://aws.amazon.com/sns/sms-pricing/](https://aws.amazon.com/sns/sms-pricing/)
- AWS Support: [https://console.aws.amazon.com/support/](https://console.aws.amazon.com/support/)

## Advantages of AWS SNS over Third-Party Services

✅ **AWS-Native Integration**
- No external accounts needed
- Uses existing AWS credentials
- Integrated with Amplify deployment

✅ **Simple Setup**
- Just add IAM permissions
- No webhook configuration
- Works out of the box

✅ **Cost-Effective**
- Pay only for what you use
- No monthly subscriptions
- Predictable pricing (~₹0.53/SMS)

✅ **Reliable**
- 99.9% SLA from AWS
- Built-in retry logic
- Delivery status tracking

✅ **Scalable**
- Handle any order volume
- No rate limits for transactional messages
- Auto-scales with your business