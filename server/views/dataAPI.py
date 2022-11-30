from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from model import db
from model.cctv import CCTV, CCTVStatus
from model.history import FloodHistory, FloodHistorySchema
from model.posting import Posting
import requests
import json

class FloodHistoryData(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('Region', type=str, help="CCTV Region", location='args', action='append')

    body = ''
    status_code = 501

    def get(self):

        args = self.parser.parse_args()
        region = args['Region']

        if region == None:
            flood_history_data = FloodHistory.query.all()

        else:
            flood_history_data = db.session.query(FloodHistory).filter(FloodHistory.CCTVID == CCTV.ID).filter(CCTV.Region.in_(region)).order_by(FloodHistory.Datetime.desc()).all()

        flood_history_schema = FloodHistorySchema(many=True)
        output = flood_history_schema.dump(flood_history_data)

        self.body = jsonify(output)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response)   


class PostingData(Resource):

    body = ''
    status_code = 501

    def get(self):

        query_result = db.session.query(Posting.Region, func.count(Posting.Region)).group_by(Posting.Region).order_by(func.count(Posting.Region).desc()).all()
        posting_data = []
        for result in query_result: 
            data_dict = {}
            data_dict["Region"] = result[0]
            data_dict["Count"] = result[1]
            posting_data.append(data_dict)
    
        self.body = jsonify(posting_data)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response)

class CCTVData(Resource):

    body = ''
    status_code = 501

    def get(self):

        cctv_names = db.session.query(FloodHistory.CCTVName, func.count(FloodHistory.CCTVName)).group_by(FloodHistory.CCTVName).order_by(func.count(FloodHistory.CCTVName).desc()).all()
        cctv_data = []  
        for name in cctv_names:
            data_dict = {}
            history_per_cctv = db.session.query(FloodHistory.CCTVName, FloodHistory.FloodStage, func.count(FloodHistory.FloodStage)).filter(FloodHistory.CCTVName == name[0]).group_by(FloodHistory.FloodStage).all()
            
            stage_dict = {}
            for history in history_per_cctv:
                stage_dict[history[1]] = history[2]

            data_dict["CCTVName"] = name[0]
            data_dict["FloodStageData"] = stage_dict
            cctv_data.append(data_dict)

        self.body = jsonify(cctv_data)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response)

