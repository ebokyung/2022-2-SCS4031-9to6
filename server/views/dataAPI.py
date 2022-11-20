from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from models import db
from models.cctv import CCTV, CCTVStatus
from models.history import FloodHistory, FloodHistorySchema
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

