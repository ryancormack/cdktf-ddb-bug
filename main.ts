import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider, AwsTerraformAdapter } from "@cdktf/aws-cdk";
import { aws_lambda, Duration } from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, "aws", { region: "eu-west-1" });

    const awsAdapter = new AwsTerraformAdapter(this, "adapter");

    const table = new Table(awsAdapter, "DemoTable", {
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING,
      },
      tableName: "demo-table",
    });

    const lambda = new NodejsFunction(awsAdapter, "DemoLambda", {
      memorySize: 256,
      runtime: aws_lambda.Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      functionName: "tf-cdk-demo",
      entry: "src/index.ts",
      timeout: Duration.minutes(2),
      environment: {
        TABLE: table.tableName,
      },
    });

    table.grantReadWriteData(lambda);
  }
}

const app = new App();
new MyStack(app, "cdktf-ddb-bug");
app.synth();
