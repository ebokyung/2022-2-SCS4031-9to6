import boto3
import os

s3_config = {
	'aws_access_key_id': os.environ.get('AWS_ACCESS_KEY_ID', 'key'),
	'aws_secret_access_key': os.environ.get('AWS_SECRET_ACCESS_KEY', 'secret'),
}

def s3_connection():
    try:
        s3 = boto3.client(
            service_name = "s3",
            region_name = "ap-northeast-2",
            aws_access_key_id = s3_config['aws_access_key_id'],
            aws_secret_access_key = s3_config['aws_secret_access_key'],
        )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3

s3 = s3_connection()