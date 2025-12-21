# IAM Grants Needed for Delivery Integration

## Required Permissions

The Lambda function (or runtime execution role) that calls `runDelivery` needs the following IAM permissions:

### 1. AWS Secrets Manager Access
```json
{
  "Effect": "Allow",
  "Action": [
    "secretsmanager:GetSecretValue"
  ],
  "Resource": [
    "arn:aws:secretsmanager:ap-south-1:*:secret:shipRocket-delivery-credentials*"
  ]
}
```

### 2. DynamoDB Table Access
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:Query",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem"
  ],
  "Resource": [
    "arn:aws:dynamodb:ap-south-1:*:table/table-tennis-shipments",
    "arn:aws:dynamodb:ap-south-1:*:table/table-tennis-shipments/index/OrderIdIndex"
  ]
}
```

## CDK Implementation

Add this to your Lambda function or execution role in `lib/table-tennis-stack.ts`:

### Option 1: Using CDK Grants (Recommended)

```typescript
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

// In your stack constructor:

// Reference existing resources
const shipmentsTable = Table.fromTableName(this, 'ShipmentsTable', 'table-tennis-shipments');
const shiprocketSecret = Secret.fromSecretNameV2(this, 'ShiprocketSecret', 'shipRocket-delivery-credentials');

// Grant permissions to your Lambda function
shipmentsTable.grantReadWriteData(yourLambdaFunction);
shiprocketSecret.grantRead(yourLambdaFunction);
```

### Option 2: Manual Policy Attachment

```typescript
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

yourLambdaFunction.addToRolePolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'secretsmanager:GetSecretValue'
  ],
  resources: [
    `arn:aws:secretsmanager:${this.region}:${this.account}:secret:shipRocket-delivery-credentials*`
  ]
}));

yourLambdaFunction.addToRolePolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'dynamodb:Query',
    'dynamodb:PutItem',
    'dynamodb:UpdateItem'
  ],
  resources: [
    `arn:aws:dynamodb:${this.region}:${this.account}:table/table-tennis-shipments`,
    `arn:aws:dynamodb:${this.region}:${this.account}:table/table-tennis-shipments/index/OrderIdIndex`
  ]
}));
```

## Environment Variables

Ensure these environment variables are set on your Lambda function:

```typescript
yourLambdaFunction.addEnvironment('SHIPROCKET_DRY_RUN', 'false'); // Set to 'true' for staging
yourLambdaFunction.addEnvironment('USE_AWS_SECRETS', 'true');
yourLambdaFunction.addEnvironment('SHIPROCKET_SECRET_NAME', 'shipRocket-delivery-credentials');
yourLambdaFunction.addEnvironment('AWS_REGION', 'ap-south-1');
yourLambdaFunction.addEnvironment('SHIPROCKET_PICKUP_LOCATION', 'Default Pickup'); // Update with your location
yourLambdaFunction.addEnvironment('SHIPROCKET_CHANNEL_ID', '1'); // Update with your channel ID
yourLambdaFunction.addEnvironment('SHIPROCKET_PICKUP_TIME', '10:00-18:00'); // Your pickup window
```

## Verification Commands

After deployment, test permissions:

### Test Secrets Manager Access
```bash
aws secretsmanager get-secret-value \
  --secret-id shipRocket-delivery-credentials \
  --region ap-south-1
```

### Test DynamoDB Access
```bash
# Query by orderId (using GSI)
aws dynamodb query \
  --table-name table-tennis-shipments \
  --index-name OrderIdIndex \
  --key-condition-expression "orderId = :oid" \
  --expression-attribute-values '{":oid":{"S":"ORDER-TEST-123"}}' \
  --region ap-south-1

# Put item (test write)
aws dynamodb put-item \
  --table-name table-tennis-shipments \
  --item '{"shipmentId":{"S":"SHIP-TEST"},"orderId":{"S":"ORDER-TEST"}}' \
  --condition-expression "attribute_not_exists(shipmentId)" \
  --region ap-south-1
```

## Troubleshooting

### Error: "User is not authorized to perform: secretsmanager:GetSecretValue"
- Check Lambda execution role has `secretsmanager:GetSecretValue` permission
- Verify resource ARN matches your secret name
- Ensure secret exists: `aws secretsmanager list-secrets --region ap-south-1`

### Error: "User is not authorized to perform: dynamodb:Query"
- Check Lambda execution role has DynamoDB permissions
- Verify table name is exactly `table-tennis-shipments`
- Ensure GSI `OrderIdIndex` exists on the table

### Error: "The table does not have the specified index: OrderIdIndex"
- Run `aws dynamodb describe-table --table-name table-tennis-shipments --region ap-south-1`
- Verify GSI exists and status is `ACTIVE`
- If missing, update CDK stack to create the GSI

## Next Steps

1. Update `lib/table-tennis-stack.ts` with IAM grants (see Option 1 above)
2. Deploy CDK stack: `npm run cdk deploy`
3. Verify permissions using test commands above
4. Run staged smoke test: `SHIPROCKET_DRY_RUN=false USE_AWS_SECRETS=true npm run delivery:smoke`
5. Check CloudWatch logs for any permission errors
