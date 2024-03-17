import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SampleDB } from "./construct/dynamodb";

export class CustomResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SampleDB(this, id);
  }
}
