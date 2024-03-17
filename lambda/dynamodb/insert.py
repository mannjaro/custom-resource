import boto3
from botocore.exceptions import ClientError


def on_event(event, context):
    print(event)
    request_type = event["RequestType"]
    if request_type == "Create":
        return on_create(event)
    if request_type == "Update":
        return on_update(event)
    if request_type == "Delete":
        return on_delete(event)
    raise Exception("Invalid request type: %s" % request_type)


def on_create(event):
    props = event["ResourceProperties"]
    print("create new resource with props %s" % props)

    dynamodb = boto3.client("dynamodb")
    try:
        dynamodb.put_item(TableName=props["tableName"], Item=props["item"])
    except ClientError as e:
        print(e)


def on_update(event):
    props = event["ResourceProperties"]
    print("update resource with props %s" % props)
    dynamodb = boto3.client("dynamodb")
    try:
        dynamodb.put_item(TableName=props["tableName"], Item=props["item"])
    except ClientError as e:
        print(e)


def on_delete(event):
    pass
