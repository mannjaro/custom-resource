import * as path from "path";
import * as crypto from "crypto";
import * as cdk from "aws-cdk-lib";
import * as cr from "aws-cdk-lib/custom-resources";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

export class SampleDB extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);
    const table = new dynamodb.TableV2(this, "SampleTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billing: dynamodb.Billing.provisioned({
        readCapacity: dynamodb.Capacity.fixed(5),
        writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 5 }),
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const insertFunc = new Function(this, "Func", {
      code: Code.fromAsset(path.join(__dirname, "../../lambda/dynamodb")),
      runtime: Runtime.PYTHON_3_11,
      handler: "insert.on_event",
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ["dynamodb:PutItem"],
          resources: ["*"],
        }),
      ],
    });
    const provider = new cr.Provider(this, "Provider", {
      onEventHandler: insertFunc,
    });

    const item = {
      id: { S: crypto.randomUUID() },
      Author: { S: "Hoge" },
      Title: { S: "Sample" },
      Option: {
        S: "Fuga",
      },
    };
    new cdk.CustomResource(this, "CustomResource", {
      serviceToken: provider.serviceToken,
      properties: {
        tableName: table.tableName,
        item: item,
      },
    });
  }
}
