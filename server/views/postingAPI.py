from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from models import db
from models.posting import Posting, PostingSchema
from views import s3
from datetime import datetime
import requests, json
import werkzeug

class Postings(Resource):
    def get(self, posting_index):
        posting = db.one_or_404(db.select(Posting).filter_by(Index=posting_index))
        posting_schema = PostingSchema()
        output = posting_schema.dump(posting)
        return jsonify({'posting' : output})

class PostingList(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('MemberID', type=str, help="Menber ID", location='form')
    parser.add_argument('Latitude', required=True, type=float, help="Latitude", location='form')
    parser.add_argument('Longitude', required=True, type=float, help="Longitude", location='form')
    parser.add_argument('Address', required=True, type=str, help="Address", location='form')
    parser.add_argument('ImageFile', type=werkzeug.datastructures.FileStorage, help="Posting Image File", location='files')
    parser.add_argument('Content', required=True, type=str, help="Posting Content", location='form')


    body = ''
    status_code = 501

    def get(self):    
        postings = Posting.query.all()
        posting_schema = PostingSchema(many=True)
        output = posting_schema.dump(postings)
        self.body = jsonify(output)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response)

    def post(self):
        args = self.parser.parse_args()

        memberID = args['MemberID']
        latitude = args['Latitude']
        longitude = args['Longitude']
        address = args['Address']
        imageFile = args['ImageFile']
        content = args['Content']

        try:
            filename = imageFile.filename.split('.')[0]
            ext = imageFile.filename.split('.')[-1]
            img_name = datetime.now().strftime(f"{filename}-%Y-%m-%d-%H-%M-%S.{ext}")

            s3_put_object(s3, '9to6bucket', imageFile, img_name)
            image_url = 'https://{bucket_name}.s3.{location}.amazonaws.com/Posting/{s3_path}'.format(bucket_name='9to6bucket', location='ap-northeast-2', s3_path=img_name)

            index = addPosting(memberID, latitude, longitude, address, content, image_url)
            query = Posting.query.get(index)
            schema = PostingSchema()
            self.body = jsonify(schema.dump(query))
            self.status_code = 201

        except IntegrityError as error:
            db.session.rollback()

            error_message = str(error)
            self.body = jsonify({"error": str(error), "type": "IntegrityError"})
            if "Duplicate entry" in error_message:
                self.status_code = 409
            else:
                self.status_code = 400

        finally:
            response = (self.body, self.status_code)
            response = make_response(response)

        return response


def addPosting(memberID, latitude, longitude, address, content, image_url):

    date_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    index = db.session.query(Posting).count() + 1
    # address = convert_coordinates_to_address(latitude, longitude)

    # 제보 객체 생성
    posting = Posting(
        Index = index,
        MemberID = memberID,
        Address = address,
        Datetime = date_time,
        ImageURL = image_url,
        Content = content,
        Longitude = longitude,
        Latitude = latitude
    )

    # 테이블에 객체 저장
    db.session.add(posting)
    db.session.commit()

    return index


# s3에 객체 업로드
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


def get_location(address):
  url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + address
  headers = {"Authorization": "KakaoAK 0db77db2aeaee483b88ae64dd6683afa"}
  api_json = json.loads(str(requests.get(url,headers=headers).text))
  # print(api_json)
  # 주소 검색 결과가 여러 개가 나올 수 있음
  address = api_json['documents'][0]['address']
#   crd = {"lat": str(address['y']), "lng": str(address['x'])}
#   address_name = address['address_name']

  return address['y'], address['x']

def convert_coordinates_to_address(lat, lng):
    """
    입력받은 위도, 경도를 도로명, 지번 주소로 변환
    """

    y, x = str(lat), str(lng)
    url = 'https://dapi.kakao.com/v2/local/geo/coord2address.json?x={}&y={}'.format(x, y)
    header = {'Authorization': 'KakaoAK ' + '0db77db2aeaee483b88ae64dd6683afa'}
 
    r = requests.get(url, headers=header)
 
    if r.status_code == 200:
        # road_address = r.json()["documents"][0]["road_address"]['address_name']
        bunji_address = r.json()["documents"][0]["address"]['address_name']
    else:
        return None
    
    return bunji_address
