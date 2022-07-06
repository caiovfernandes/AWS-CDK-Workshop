import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway'
import * as cloudtrail from '@aws-cdk/aws-cloudtrail'
import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // AWS Lambda Resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,  //Execution environment
      code: lambda.Code.fromAsset('lambda'), // Code loaded from "lambda" dir
      handler: 'hello.handler' // File is "hello", function is "handler"
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    // Defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });

    new cloudtrail.Trail(this, 'MyTrail');
  }
}
