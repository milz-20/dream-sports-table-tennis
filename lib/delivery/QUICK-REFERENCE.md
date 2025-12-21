# Shiprocket Delivery - Quick Reference

## 🚀 Quick Start

### Run Tests Locally
```bash
# Duplicate prevention test (mock storage)
npm run delivery:test-duplicate

# Smoke test (mock storage)
npm run delivery:smoke

# All Shiprocket tests
npm run shiprocket:test
```

### Test with Real DynamoDB
```bash
# Requires: AWS credentials configured
USE_DYNAMODB=true npm run delivery:test-duplicate
```

### Staged Test (Real Shiprocket API)
```bash
# Requires: Real credentials in Secrets Manager
SHIPROCKET_DRY_RUN=false USE_AWS_SECRETS=true npm run delivery:smoke
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `delivery-controller.ts` | Main orchestration + idempotency logic |
| `storage-adapter-mock.ts` | In-memory storage (local testing) |
| `storage-adapter-dynamo.ts` | Real DynamoDB persistence |
| `main-controller-example.ts` | Integration pattern example |
| `shiprocket-client.ts` | HTTP client for Shiprocket API |
| `shiprocket-service.ts` | Order-to-payload mapping |
| `INTEGRATION-SUMMARY.md` | Full implementation details |
| `IAM-GRANTS-NEEDED.md` | Permissions setup guide |

## 🔧 Environment Variables

### Development (Dry-Run)
```bash
SHIPROCKET_DRY_RUN=true          # Default - safe for testing
USE_AWS_SECRETS=false             # Use .env file credentials
```

### Staging/Production
```bash
SHIPROCKET_DRY_RUN=false         # Enable real API calls
USE_AWS_SECRETS=true              # Fetch from Secrets Manager
SHIPROCKET_SECRET_NAME=shipRocket-delivery-credentials
AWS_REGION=ap-south-1
SHIPROCKET_PICKUP_LOCATION=Default Pickup
SHIPROCKET_CHANNEL_ID=1
SHIPROCKET_PICKUP_TIME=10:00-18:00
```

## 🎯 Integration Pattern

```typescript
import { runDelivery } from './lib/delivery/delivery-controller';
import { createDynamoAdapter } from './lib/delivery/storage-adapter-dynamo';

// In your order payment handler:
const result = await runDelivery(order, {
  notifyPhone: order.customer.phone,
  storage: createDynamoAdapter(), // or storageAdapterMock for testing
});

if (!result.ok) {
  // Handle error
  console.error('Delivery failed:', result.error);
  return;
}

if (result.fromCache) {
  // Duplicate prevented - order already shipped
  console.log('Order already shipped:', result.shiprocket?.awb_code);
} else {
  // New shipment created
  console.log('Shipment created:', result.shiprocket?.shipment_id);
  console.log('Pickup scheduled:', result.pickup?.pickup_scheduled_date);
}
```

## ✅ Pre-Deploy Checklist

- [ ] Update Secrets Manager with real Shiprocket credentials
- [ ] Add IAM grants for DynamoDB and Secrets Manager (see `IAM-GRANTS-NEEDED.md`)
- [ ] Set environment variables on Lambda/ECS
- [ ] Deploy CDK stack: `npm run cdk deploy`
- [ ] Run staged smoke test
- [ ] Verify shipment in Shiprocket dashboard
- [ ] Verify record in DynamoDB table

## 🐛 Troubleshooting

### Test Fails with "The table does not have the specified index"
- Table not deployed yet OR
- Using DynamoDB adapter in test that expects mock
- Solution: Use `npm run delivery:test-duplicate` (defaults to mock)

### "User is not authorized to perform: secretsmanager:GetSecretValue"
- Missing IAM permissions
- Solution: See `IAM-GRANTS-NEEDED.md` for required grants

### Pickup creation fails but shipment succeeds
- This is normal - pickup failures are non-blocking
- Check logs for pickup error details
- Manually schedule pickup in Shiprocket dashboard if needed

### Duplicate shipments still created
- Check DynamoDB table has `OrderIdIndex` GSI
- Verify storage adapter is being passed to `runDelivery`
- Check CloudWatch logs for conditional write failures

## 📊 Monitor & Debug

### Check Failure Logs
```bash
cat lib/delivery/delivery_jira_log.jsonl
```

### Query DynamoDB for Order
```bash
aws dynamodb query \
  --table-name table-tennis-shipments \
  --index-name OrderIdIndex \
  --key-condition-expression "orderId = :oid" \
  --expression-attribute-values '{":oid":{"S":"ORDER-123"}}' \
  --region ap-south-1
```

### Check Lambda Logs
```bash
aws logs tail /aws/lambda/your-function-name --follow
```

## 🎉 Success Indicators

✅ Test passes: `npm run delivery:test-duplicate` shows `fromCache: true` for duplicate calls
✅ Storage shows 1 record per unique order ID
✅ Dry-run logs show shipment and pickup payloads
✅ Staged test creates shipment in Shiprocket dashboard
✅ DynamoDB record persisted with shipment_id and tracking number

## 📞 Need Help?

1. Read `INTEGRATION-SUMMARY.md` for complete details
2. Check `SHIPROCKET.md` for API documentation
3. Review `main-controller-example.ts` for usage pattern
4. Run tests to verify setup: `npm run delivery:test-duplicate`
