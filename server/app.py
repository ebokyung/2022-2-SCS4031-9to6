from flask import Flask, abort, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO,emit
from datetime import timedelta
from sqlalchemy.exc import IntegrityError
from model import db
from model.cctv import CCTV
from model.chatlog import Chatlog, ChatlogSchema

import sys
from pathlib import Path
from views import s3

from views.cctvAPI import CCTVS, CCTVList
from views.memberAPI import Members, MemberList, MemberCheck, Login, Logout
from views.historyAPI import FloodHistoryList
from views.shelterAPI import Shelters, ShelterList
from views.postingAPI import Postings, PostingList, MemberPostings
from views.bookmarkAPI import Bookmarks
from views.bookmarkAPI import Bookmarks2
from views.dataAPI import FloodHistoryData, PostingData, CCTVData
from views.bookmarkAPI import Bookmarks3
# from views.modelAPI import AIModel
# from tasks import ffmpeg
import config


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.alchemy_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_AS_ASCII'] = False
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30) # 로그인세션 유지시간 30분 설정
app.secret_key = '#$DSF51wfdFF2WE^4&@#$' # 세션 시크릿키


migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

# add ROOT to PATH
FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))
 

# 모든 도메인에 대하여 CORS 설정
CORS(app)
# 특정 주소, 도메인, 포트 등만 사용 가능하도록 설정
# CORS(app, resources={r'*': {'origins': 'https://webisfree.com:3000'}})
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    # print(request.sid)
    # print("client has connected")
    chatlogs = Chatlog.query.all()
    chatlog_schema = ChatlogSchema(many=True)
    output = chatlog_schema.dump(chatlogs)
    print(output)
    # emit("connect",{"data":f"id: {request.sid} is connected"})
    emit("connect", output)

@socketio.on('message')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ",str(data), "with request sid: ", str(request.sid))
    log = Chatlog(
        id = data['id'],
        user = data['user'],
        body = data['body'],
        time = data['time']
    )
    db.session.add(log)
    db.session.commit()
    chatlogs = Chatlog.query.all()
    chatlog_schema = ChatlogSchema(many=True)
    output = chatlog_schema.dump(chatlogs)
    print(output)
    emit("message",output,broadcast=True)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

# @app.route('/', methods=['GET'])
# def index():
#        return "Flooding24"
 

# @app.route('/ffmpeg/<cctv_id>')
# def call_ffmpeg_download(cctv_id):
#     cctv = db.one_or_404(db.select(CCTV).filter_by(ID=cctv_id))
#     url = cctv.URL
#     f = ffmpeg.delay(url)
#     return jsonify({'task_id': f.id})


# @app.route('/ffmpeg_status/<task_id>')
# def ffmpeg_status(task_id):
#     task = ffmpeg.AsyncResult(task_id)
#     return jsonify({'state': task.state})


# @app.route('/ffmpeg_result/<task_id>')
# def ffmpeg_result(task_id):
#     result = ffmpeg.AsyncResult(task_id).result
#     return jsonify({'file_name': result})


# Users API Route
api.add_resource(CCTVS, '/cctvs/<cctv_id>')
api.add_resource(CCTVList, '/cctvs')
api.add_resource(Members, '/Members/<member_id>')
api.add_resource(MemberList, '/Members')
api.add_resource(MemberCheck, '/MembersCheck/<member_id>')
api.add_resource(FloodHistoryList, '/FloodHistories')
api.add_resource(Shelters, '/Shelters/<shelter_index>')
api.add_resource(ShelterList, '/Shelters')
api.add_resource(Postings, '/Postings/<posting_index>')
api.add_resource(MemberPostings, '/Postings/Member/<member_id>')
api.add_resource(PostingList, '/Postings')
api.add_resource(Login, '/Login')
api.add_resource(Logout, '/Logout')
# api.add_resource(AIModel, '/inference/<cctv_id>')
api.add_resource(Bookmarks, '/Bookmark')
api.add_resource(Bookmarks2, '/Bookmark/<M_ID>/<C_ID>')
api.add_resource(FloodHistoryData, '/Data/FloodHistory')
api.add_resource(PostingData, '/Data/Posting')
api.add_resource(CCTVData, '/Data/CCTV')
api.add_resource(Bookmarks3, '/Bookmark/<m_id>')


if __name__ == "__main__":
    # app.run(host="0.0.0.0", debug=True, port=5000)
    socketio.run(app, host="0.0.0.0", debug=True, port=5000)
