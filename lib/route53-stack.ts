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

    // Domain will be added manually through Amplify Console
    // The hosted zone is ready and nameservers are configured

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

    new cdk.CfnOutput(this, 'NameServerInstructions', {
      value: 'Nameservers are configured. Add custom domain manually in Amplify Console.',
      description: 'Domain registrar configuration',
    });
  }
}
