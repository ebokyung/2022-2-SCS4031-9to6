from flask import jsonify
from flask_restful import Resource
from models import db
from models.history import FloodHistory, FloodHistorySchema
from views import s3

def s3_put_object(s3, bucket, filepath, access_key):
    """
    s3 bucket에 지정 파일 업로드
    :param s3: 연결된 s3 객체(boto3 client)
    :param bucket: 버킷명
    :param filepath: 파일 위치
    :param access_key: 저장 파일명
    :return: 성공 시 True, 실패 시 False 반환
    """
    try:
        s3.upload_file(
            Filename=filepath,
            Bucket=bucket,
            Key=access_key,
            ExtraArgs={"ContentType": "image/jpg", "ACL": "public-read"},
        )
    except Exception as e:
        print(e)
        return False
    return True

ret = s3_put_object(s3, '9to6bucket', 'flooding.jpg', 'flooding.jpg')
if ret: print('success')
else: print('fail')