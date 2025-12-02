import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';

export interface Route53StackProps extends cdk.StackProps {
  amplifyAppId?: string;
  branchName?: string;
}

export class Route53Stack extends cdk.Stack {
  public readonly hostedZone: route53.IHostedZone;

  constructor(scope: Construct, id: string, props?: Route53StackProps) {
    super(scope, id, props);

    // Create Route53 Public Hosted Zone for punetabletennis.in
    this.hostedZone = new route53.PublicHostedZone(this, 'PuneTTHostedZone', {
      zoneName: 'punetabletennis.in',
      comment: 'Hosted zone for Pune Table Tennis website',
    });

    // Use the existing Amplify App ID directly
    const amplifyAppId = 'djgag8h9oiav8'; // Your Amplify App ID
    const branchName = 'main'; // The branch name in Amplify (manually deployed)

    // Add custom domain to Amplify
    const domain = new amplify.CfnDomain(this, 'AmplifyCustomDomain', {
      appId: amplifyAppId,
      domainName: 'punetabletennis.in',
      subDomainSettings: [
        {
          branchName: branchName,
          prefix: '',
        },
        {
          branchName: branchName,
          prefix: 'www',
        },
      ],
      enableAutoSubDomain: false,
    });

    // Output the Hosted Zone ID
    new cdk.CfnOutput(this, 'HostedZoneId', {
      value: this.hostedZone.hostedZoneId,
      description: 'Route53 Hosted Zone ID',
      exportName: 'PuneTT-HostedZoneId',
    });

    // Output the Name Servers
    new cdk.CfnOutput(this, 'NameServers', {
      value: cdk.Fn.join(', ', this.hostedZone.hostedZoneNameServers || []),
      description: 'Name servers to configure at your domain registrar',
      exportName: 'PuneTT-NameServers',
    });

    // Output the Zone Name
    new cdk.CfnOutput(this, 'ZoneName', {
      value: this.hostedZone.zoneName,
      description: 'Hosted Zone Name',
      exportName: 'PuneTT-ZoneName',
    });

    // Output domain configuration details
    new cdk.CfnOutput(this, 'CustomDomainName', {
      value: domain.domainName,
      description: 'Custom domain configured for Amplify',
    });

    new cdk.CfnOutput(this, 'DomainStatus', {
      value: domain.attrStatusReason,
      description: 'Domain configuration status',
    });

    new cdk.CfnOutput(this, 'NameServerInstructions', {
      value: 'Update your domain registrar nameservers with the Route53 nameservers listed above',
      description: 'Domain registrar configuration',
    });

    new cdk.CfnOutput(this, 'CustomDomainURL', {
      value: `https://punetabletennis.in`,
      description: 'Your custom domain URL (will be active after DNS propagation)',
    });
  }
}
