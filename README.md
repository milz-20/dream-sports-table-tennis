# Dream Sports Table Tennis - AWS Infrastructure

This project contains the AWS CDK infrastructure and React web application for a table tennis coaching and equipment business.

## Project Structure

```
├── bin/                    # CDK app entry point
├── lib/                    # CDK stack definitions
├── web/                    # React web application
│   ├── public/            # Static assets
│   ├── src/               # React components and pages
│   └── package.json       # Web app dependencies
├── cdk.json               # CDK configuration
├── package.json           # CDK dependencies
└── tsconfig.json          # TypeScript configuration
```

## AWS Infrastructure

The CDK stack deploys the following resources:

### DynamoDB Tables
- **Customers Table**: Store customer information with email index
- **Coaching Sessions Table**: Store coaching session bookings with customer and date indices
- **Equipment Table**: Store product inventory with category index
- **Orders Table**: Store equipment orders with customer index
- **Inquiries Table**: Store contact form submissions

### AWS Amplify
- Hosting for the React web application
- Automatic deployments from Git repository
- Custom domain support (configure separately)

## Prerequisites

- Node.js (v18 or later)
- AWS CLI configured with appropriate credentials
- AWS CDK CLI (`npm install -g aws-cdk`)
- Git repository (GitHub, CodeCommit, etc.) for Amplify deployment

## Installation

### 1. Install CDK Dependencies

```powershell
npm install
```

### 2. Install Web Application Dependencies

```powershell
cd web
npm install
cd ..
```

## Deployment

### 1. Bootstrap CDK (First time only)

```powershell
npm run bootstrap
```

### 2. Build CDK Stack

```powershell
npm run build
```

### 3. Review CloudFormation Template

```powershell
npm run synth
```

### 4. Deploy Infrastructure

```powershell
npm run deploy
```

After deployment, note the outputs including:
- DynamoDB table names
- Amplify App ID
- Website URL

### 5. Connect Amplify to Git Repository

After CDK deployment, you need to connect your Amplify app to a Git repository:

1. Push your web application code to a Git repository (GitHub, CodeCommit, etc.)
2. Go to AWS Amplify Console
3. Find your app (table-tennis-website)
4. Connect it to your Git repository
5. Configure build settings:
   - Build command: `npm run build`
   - Base directory: `web`
   - Output directory: `build`

Alternatively, you can use Amplify CLI for manual deployments:

```powershell
cd web
npm run build
# Use Amplify Console to manually upload the build folder
```

## Local Development

### Run Web Application Locally

```powershell
cd web
npm start
```

The application will open at http://localhost:3000

## Available Scripts

### CDK Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm run synth` - Synthesize CloudFormation template
- `npm run deploy` - Deploy stack to AWS
- `npm run destroy` - Destroy all resources (use with caution)

### Web App Scripts
- `cd web && npm start` - Run development server
- `cd web && npm run build` - Build for production
- `cd web && npm test` - Run tests

## Environment Configuration

The following environment variables are automatically set in Amplify:
- `CUSTOMERS_TABLE` - DynamoDB customers table name
- `COACHING_SESSIONS_TABLE` - DynamoDB coaching sessions table name
- `EQUIPMENT_TABLE` - DynamoDB equipment table name
- `ORDERS_TABLE` - DynamoDB orders table name
- `INQUIRIES_TABLE` - DynamoDB inquiries table name
- `AWS_REGION` - AWS region

## Custom Domain Setup

To configure a custom domain:

1. Go to AWS Amplify Console
2. Select your app
3. Go to "Domain management"
4. Add your custom domain
5. Follow the DNS configuration instructions

## DynamoDB Table Schemas

### Customers Table
- Partition Key: `customerId` (String)
- Sort Key: `email` (String)
- Attributes: name, phone, address, registrationDate, etc.

### Coaching Sessions Table
- Partition Key: `sessionId` (String)
- Sort Key: `sessionDate` (String)
- Attributes: customerId, coachName, sessionType, status, notes, etc.

### Equipment Table
- Partition Key: `productId` (String)
- Sort Key: `category` (String)
- Attributes: productName, description, price, stock, brand, etc.

### Orders Table
- Partition Key: `orderId` (String)
- Sort Key: `orderDate` (String)
- Attributes: customerId, items, totalAmount, status, shippingAddress, etc.

### Inquiries Table
- Partition Key: `inquiryId` (String)
- Sort Key: `submittedDate` (String)
- Attributes: name, email, phone, subject, message, status, etc.

## Security Considerations

- All DynamoDB tables use AWS managed encryption
- Point-in-time recovery enabled for all tables
- Tables have RETAIN removal policy to prevent accidental data loss
- Amplify uses IAM roles with least privilege access

## Cost Optimization

- DynamoDB tables use PAY_PER_REQUEST billing mode (good for variable workloads)
- Consider switching to PROVISIONED mode if traffic becomes consistent
- Monitor Amplify build minutes and bandwidth usage

## Next Steps

1. Connect Amplify to your Git repository
2. Configure custom domain
3. Implement API Gateway + Lambda for backend operations
4. Add AWS Cognito for user authentication
5. Implement shopping cart and payment integration
6. Add email notifications (SES or SNS)
7. Set up monitoring and alerts (CloudWatch)

## Support

For issues or questions, please refer to:
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

## License

ISC