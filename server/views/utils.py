# s3에 객체 업로드
from views import s3


def s3_upload_file(s3, bucket, filepath, access_key):
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

# ret = s3_put_object(s3, '9to6bucket', 'flooding.jpg', 'flooding.jpg')
# if ret: print('success')
# else: print('fail')


def s3_put_object(s3, bucket, file, filename):
    """
    s3 bucket에 지정 파일 업로드
    :param s3: 연결된 s3 객체(boto3 client)
    :param bucket: 버킷명
    :param file: 파일
    :param filename: 저장 파일명
    :return: 성공 시 True, 실패 시 False 반환
    """
    try:
        s3.put_object(
            Body=file,
            Bucket=bucket,
            Key=f'Posting/{filename}',
            ContentType=file.content_type,
            ACL='public-read',
            # ExtraArgs={"ContentType": "image/jpg", "ACL": "public-read"},
        )
        
    except Exception as e:
        print(e)
        return False
    return True  

def s3_delete_image(imageURL):
    path = imageURL[51:]
    s3.delete_object(Bucket='9to6bucket', Key=path)   
