import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Approach 1 - implicit with `addToResourcePolicy`
     */

    // 👇 create the s3 bucket
    const bucket1 = new s3.Bucket(this, 'bucket-id-1', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 👇 `addToResourcePolicy` creates a Bucket Policy automatically
    bucket1.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [`${bucket1.bucketArn}/*`],
      }),
    );

    // 👇 access the bucket policy
    bucket1.policy?.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:GetBucketTagging'],
        resources: [bucket1.bucketArn],
      }),
    );

    /**
     * Approach 2 - explicit with `BucketPolicy`
     */

    // 👇 create the s3 bucket
    const bucket2 = new s3.Bucket(this, 'bucket-id-2', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 👇 create the bucket policy
    const bucketPolicy = new s3.BucketPolicy(this, 'bucket-policy-id-2', {
      bucket: bucket2,
    });

    // 👇 add policy statements ot the bucket policy
    bucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [`${bucket2.bucketArn}/*`],
      }),
    );
  }
}
