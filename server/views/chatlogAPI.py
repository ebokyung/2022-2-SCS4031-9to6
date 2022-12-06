from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from model import db
from model.chatlog import Chatlog, ChatlogSchema
from datetime import datetime
import requests, json

 
class ChatlogList(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('id', type=str, required=True, location='form')
    parser.add_argument('user', required=True, type=str, location='form')
    parser.add_argument('body', required=True, type=str, location='form')
    parser.add_argument('time', required=True, type=str, location='form')

    body = ''
    status_code = 501

    def get(self):
        chatlogs = Chatlog.query.all()
        chatlog_schema = ChatlogSchema(many=True)
        output = chatlog_schema.dump(chatlogs)    
        self.body = jsonify(output)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response)

    def post(self):
        args = self.parser.parse_args()

        ID = args['id']
        USER = args['user']
        BODY = args['body']
        TIME = args['time']

        log = Chatlog(
                        id = ID,
                        user = USER,
                        body = BODY,
                        time = TIME
                    )
        db.session.add(log)
        db.session.commit()

    def delete(self):
        db.session.query(Chatlog).delete()
        db.session.commit()
