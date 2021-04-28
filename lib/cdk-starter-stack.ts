import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 create the s3 bucket
    const bucket = new s3.Bucket(this, 'bucket-id');

    // 👇 create the bucket policy
    const bucketPolicy = new s3.BucketPolicy(this, 'bucket-policy-id', {
      bucket,
    });

    // 👇 add policy statements ot the bucket policy
    bucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.AccountRootPrincipal(),
          new iam.ServicePrincipal('lambda.amazonaws.com'),
        ],
        actions: ['s3:GetObject'],
        resources: [`${bucket.bucketArn}/*`],
      }),
    );
  }
}
