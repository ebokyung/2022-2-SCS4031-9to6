from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from models import db
from models.cctv import CCTV, CCTVStatus
from models.history import FloodHistory, FloodHistorySchema
from views import s3
from urllib.parse import urlencode, unquote
import requests
import json
from datetime import datetime, date, timedelta
import math

class FloodHistoryList(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('ID', required=True, type=str, help="CCTV ID", location='json')
    parser.add_argument('STAGE', required=True, type=int, help="Detected Flooding Stage", location='json')
    parser.add_argument('URL', type=str, help="Flooding Image URL", location='json')

    body = ''
    status_code = 501

    def get(self):    
        flood_histories = FloodHistory.query.all()
        flood_history_schema = FloodHistorySchema(many=True)
        output = flood_history_schema.dump(flood_histories)
        self.body = jsonify(output)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response)   

    def post(self):
        args = self.parser.parse_args()
        cctvID = args['ID']
        stage = args['STAGE']
        url = args['URL']

        try:
            date_time = addFloodHistory(cctvID, stage, url)
            query = FloodHistory.query.get((date_time, cctvID))
            schema = FloodHistorySchema()
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


# 머신러닝 모델이 Result[cctvID, stage, imageURL]을 리턴한다고 가정
# cctvID: 침수 단계가 판별되는 cctv의 ID
# stage: 모델이 판별한 침수 단계
# imageURL: 모델이 침수 단계 판별에 사용한 cctv 이미지를 s3 버킷에 올렸을 때 해당 객체의 URL

# 침수 이력 저장 함수
# addFloodHistory('E910054', 1, 'https://9to6bucket.s3.ap-northeast-2.amazonaws.com/s3.png') 
def addFloodHistory(cctvID, stage, imageURL):
    cctv = CCTVStatus.query.get(cctvID)
    original_stage = cctv.FloodingStage
    detected_stage = stage

    # 테이블에 기록된 침수 단계와 모델이 판별한 침수 단계가 다를 경우
    if original_stage != detected_stage:
        # 테이블에 기록된 침수 단계 업데이트
        cctv.FloodingStage = stage

        # 기상청 초단기실황 api에서 온도, 습도, 1시간 강수량 가져오기
        temperature, humidity, precipitation = getWeather(cctvID)

        date_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # 침수 이력 객체 생성
        flood_history = FloodHistory(
            Datetime = date_time,
            CCTVID = cctvID,
            FloodStage = detected_stage,
            ImageURL = imageURL,
            Temperature = temperature,
            Humidity = humidity,
            Precipitation = precipitation
        )

        # 테이블에 객체 저장
        db.session.add(flood_history)
        db.session.commit()

        return date_time

    # 침수 단계 변화가 없는 경우 False 리턴
    else:
        return False



# s3에 객체 업로드
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

# ret = s3_put_object(s3, '9to6bucket', 'flooding.jpg', 'flooding.jpg')
# if ret: print('success')
# else: print('fail')

# 기상청 초단기실황 api

# base_time와 base_date 구하는 함수
def getBase():
    now = datetime.now()
    today = datetime.today().strftime("%Y%m%d")
    y = date.today() - timedelta(days=1)
    yesterday = y.strftime("%Y%m%d")
        
    if now.minute < 40: 
        if now.hour == 0:
            base_time = "2300"
            base_date = yesterday
        else:
            pre_hour = now.hour-1
            if pre_hour<10:
                base_time = "0" + str(pre_hour) + "00"
            else:
                base_time = str(pre_hour) + "00"
            base_date = today
    else:
        base_time = now.strftime("%H00")
        base_date = today
    
    return base_date, base_time


Re = 6371.00877     ##  지도반경
grid = 5.0          ##  격자간격 (km)
slat1 = 30.0        ##  표준위도 1
slat2 = 60.0        ##  표준위도 2
olon = 126.0        ##  기준점 경도
olat = 38.0         ##  기준점 위도
xo = 210 / grid     ##  기준점 X좌표
yo = 675 / grid     ##  기준점 Y좌표
first = 0

if first == 0 :
    PI = math.asin(1.0) * 2.0
    DEGRAD = PI/ 180.0
    RADDEG = 180.0 / PI


    re = Re / grid
    slat1 = slat1 * DEGRAD
    slat2 = slat2 * DEGRAD
    olon = olon * DEGRAD
    olat = olat * DEGRAD

    sn = math.tan(PI * 0.25 + slat2 * 0.5) / math.tan(PI * 0.25 + slat1 * 0.5)
    sn = math.log(math.cos(slat1) / math.cos(slat2)) / math.log(sn)
    sf = math.tan(PI * 0.25 + slat1 * 0.5)
    sf = math.pow(sf, sn) * math.cos(slat1) / sn
    ro = math.tan(PI * 0.25 + olat * 0.5)
    ro = re * sf / math.pow(ro, sn)
    first = 1

# 위도, 경도를 x, y 좌표로 변경하는 함수
def mapToGrid(lat, lon, code = 0 ):
    ra = math.tan(PI * 0.25 + lat * DEGRAD * 0.5)
    ra = re * sf / pow(ra, sn)
    theta = lon * DEGRAD - olon
    if theta > PI :
        theta -= 2.0 * PI
    if theta < -PI :
        theta += 2.0 * PI
    theta *= sn
    x = (ra * math.sin(theta)) + xo
    y = (ro - ra * math.cos(theta)) + yo
    x = int(x + 1.5)
    y = int(y + 1.5)
    return x, y

# 초단기실황 api를 호출해 온도, 습도, 1시간 강수량을 리턴하는 함수
def getWeather(cctvID):
    base_date, base_time = getBase()
    cctv = CCTV.query.get(cctvID)
    lat = cctv.Latitude
    lon = cctv.Longitude
    nx, ny = mapToGrid(lat, lon)

    ls_url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"
    ls_url2 = "?" + urlencode(

            {

                    "ServiceKey" : unquote("Ig305vjzG01urQJR7VkY6XXiBDTkRkJ5b8Jar3cyq5Q6tl4neoFjq5u%2FhitQ0CB1CB%2BfD3PmaJa2Xo6ZWVaqXw%3D%3D"),

                    "base_date" : base_date,

                    "base_time" : base_time,

                    "nx" : nx,

                    "ny" : ny,

                    "numOfRows" : "10",

                    "pageNo" : 1,

                    "dataType" : "JSON",

            }

    )


    ls_queryurl = ls_url + ls_url2
    # 위에 있는 ls_queryurl 대신에 아래의 한줄을 사용하여도 됨
    # ls_queryurl= "http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst?ServiceKey=인증키&base_date=20210709&base_time=1500&nx=55&ny=125&numOfRows=10&pageNo=1&dataType=JSON"

    response = requests.get(ls_queryurl, verify=False) #해당url주소의 데이터를 가져와서 response에 담는다
    ls_dict = json.loads(response.text) #json문자열을 파이썬 객체로 변환한다.

    ls_response = ls_dict.get("response")
    ls_body = ls_response.get("body")
    ls_items = ls_body.get("items")
    ls_item = ls_items.get("item")

    result={} # result라는 딕셔너리 변수를 선언함, 딕셔너리는 초기화를 해야 사용할수 있다
    result_dict={}  # result_dict라는 키와 값을 담아둘 딕셔너리를 선언하고 초기화를 시킨다.

    #루프문에서 result_dict 에는 키와 값을 담아둔다 예)result_dict['PTY']='0'  , result_status['REH']='97'
    for item in ls_item:  #ls_item에 들어있는 배열의 개수만큼 반복함
        result=item
        print(result)
        result_dict.setdefault(result.get("category"),result.get("obsrValue"))

    return result_dict["T1H"], result_dict["REH"], result_dict["RN1"]
    # print("날짜 : "+result.get("baseDate")[:-4]+"년"+result.get("baseDate")[4:-2]+"월"+result.get("baseDate")[6:]+"일"+"시간 : " + result.get("baseTime")[:-2]+"시")
    # print("강우형태 : "+result_dict["PTY"])
    # print("습도 : "+result_dict["REH"]+" %")
    # print("1시간 강수량 : " +result_dict["RN1"]+" mm")
    # print("기온 : "+result_dict["T1H"] +" ℃")
    # print("동서바람성분 : " +result_dict["UUU"]+" m/s")
    # print("남북바람성분 : " + result_dict["VVV"]+" m/s")
    # print("풍향 : "+result_dict["VEC"])
    # print("풍속 : "+result_dict["WSD"])