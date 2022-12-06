from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from model import db
from model.cctv import CCTV, CCTVStatus
from model.history import FloodHistory, FloodHistorySchema
from views import s3
import requests
import json
from datetime import datetime, date, timedelta
from views.utils import s3_upload_file, s3_delete_image
from views.weatherAPI import getWeather, mapToGrid, getBase

class FloodHistoryList(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('ID', required=True, type=str, help="CCTV ID", location='form')
    parser.add_argument('STAGE', required=True, type=int, help="Detected Flooding Stage", location='form')
    parser.add_argument('CHANGE', required=True, type=str, help="Flooding Stage Change", location='form')
    parser.add_argument('URL', type=str, help="Flooding Image URL", location='form')

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
        change = args['CHANGE']
        url = args['URL']

        try:
            date_time = addFloodHistory(cctvID, stage, change, url)
            query = FloodHistory.query.get((date_time, cctvID))
            schema = FloodHistorySchema()
            self.body = jsonify(schema.dump(query))
            self.status_code = 201
            print("history added")

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
def addFloodHistory(cctvID, stage, change, imageURL):
    cctv = CCTVStatus.query.get(cctvID)
    cctv.FloodingStage = stage

    # 기상청 초단기실황 api에서 온도, 습도, 1시간 강수량 가져오기
    temperature, humidity, precipitation = getWeather(cctvID)

    date_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cctvName = CCTV.query.get(cctvID).Name

    # 침수 이력 객체 생성
    flood_history = FloodHistory(
        Datetime = date_time,
        CCTVID = cctvID,
        CCTVName = cctvName,
        FloodStage = stage,
        StageChange = change,
        ImageURL = imageURL,
        Temperature = temperature,
        Humidity = humidity,
        Precipitation = precipitation
    )

    # 테이블에 객체 저장
    db.session.add(flood_history)
    db.session.commit()

    return date_time
