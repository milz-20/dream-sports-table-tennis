import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export class S3CloudFrontStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly distributionDomainName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket for storing images
    this.bucket = new s3.Bucket(this, 'TableTennisImagesBucket', {
      bucketName: `table-tennis-images-${this.account}`,
      // Block all public access - CloudFront will access it
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      // Enable versioning for safety
      versioned: true,
      // Lifecycle rules to optimize storage costs
      lifecycleRules: [
        {
          // Move old versions to cheaper storage after 30 days
          noncurrentVersionTransitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
          ],
          // Delete old versions after 90 days
          noncurrentVersionExpiration: cdk.Duration.days(90),
        },
      ],
      // Enable encryption at rest
      encryption: s3.BucketEncryption.S3_MANAGED,
      // CORS configuration for web access
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3600,
        },
      ],
      // Remove bucket on stack deletion (set to RETAIN for production)
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create Origin Access Identity for CloudFront to access S3
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: 'OAI for Table Tennis Images',
    });

    // Grant CloudFront read access to the bucket
    this.bucket.grantRead(originAccessIdentity);

    // Create CloudFront distribution
    this.distribution = new cloudfront.Distribution(this, 'TableTennisImagesDistribution', {
      comment: 'CDN for Table Tennis Equipment Images',
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        compress: true,
        cachePolicy: new cloudfront.CachePolicy(this, 'ImagesCachePolicy', {
          cachePolicyName: 'TableTennisImagesCachePolicy',
          comment: 'Cache policy for table tennis images',
          defaultTtl: cdk.Duration.days(30),
          maxTtl: cdk.Duration.days(365),
          minTtl: cdk.Duration.days(1),
          cookieBehavior: cloudfront.CacheCookieBehavior.none(),
          headerBehavior: cloudfront.CacheHeaderBehavior.none(),
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
          enableAcceptEncodingGzip: true,
          enableAcceptEncodingBrotli: true,
        }),
      },
      // Enable IPv6
      enableIpv6: true,
      // HTTP/2 and HTTP/3 support
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      // Price class for cost optimization (use all edge locations for best performance)
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      // Error responses
      errorResponses: [
        {
          httpStatus: 404,
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    // Deploy existing images from public/assets to S3
    new s3deploy.BucketDeployment(this, 'DeployImages', {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, '../web-nextjs/public/assets')),
      ],
      destinationBucket: this.bucket,
      destinationKeyPrefix: 'assets', // Keep the same folder structure
      distribution: this.distribution,
      distributionPaths: ['/*'], // Invalidate all paths after deployment
      // Prune old files that are not in the source
      prune: false,
      // Set cache control headers
      cacheControl: [
        s3deploy.CacheControl.maxAge(cdk.Duration.days(30)),
        s3deploy.CacheControl.sMaxAge(cdk.Duration.days(365)),
      ],
      contentType: 'image/*',
    });

    this.distributionDomainName = this.distribution.distributionDomainName;

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 Bucket name for images',
      exportName: 'TableTennisImagesBucketName',
    });

    new cdk.CfnOutput(this, 'BucketArn', {
      value: this.bucket.bucketArn,
      description: 'S3 Bucket ARN',
      exportName: 'TableTennisImagesBucketArn',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront Distribution ID',
      exportName: 'TableTennisImagesDistributionId',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distributionDomainName,
      description: 'CloudFront Distribution Domain Name - Use this as your CDN URL',
      exportName: 'TableTennisImagesDistributionDomain',
    });

    new cdk.CfnOutput(this, 'CDNUrl', {
      value: `https://${this.distributionDomainName}/assets/`,
      description: 'Full CDN URL for assets (use this in your Next.js app)',
      exportName: 'TableTennisImagesCDNUrl',
    });

    // Add tags
    cdk.Tags.of(this).add('Project', 'TableTennis');
    cdk.Tags.of(this).add('Environment', 'Production');
    cdk.Tags.of(this).add('ManagedBy', 'CDK');
  }
}
