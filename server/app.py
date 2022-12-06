from flask import Flask, abort, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO,emit
from datetime import timedelta, datetime
from sqlalchemy.exc import IntegrityError
from model import db
from model.cctv import CCTV, CCTVStatus
from model.chatlog import Chatlog, ChatlogSchema

import sys
from pathlib import Path
from views import s3

from views.cctvAPI import CCTVS, CCTVList, CCTVSStatus
from views.memberAPI import Members, MemberList, MemberCheck, Login, Logout
from views.historyAPI import FloodHistoryList
from views.shelterAPI import Shelters, ShelterList
from views.postingAPI import Postings, PostingList, MemberPostings
from views.bookmarkAPI import Bookmarks
from views.bookmarkAPI import Bookmarks2
from views.dataAPI import FloodHistoryData, PostingData, CCTVData
from views.bookmarkAPI import Bookmarks3
from views.weatherAPI import getWeather, mapToGrid, getBase
from views.chatlogAPI import ChatlogList
#from views.modelAPI import AIModel
#from tasks import ffmpeg
import config
import requests
import json


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
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
import eventlet
eventlet.monkey_patch()

# @socketio.on("connect")
# def connected():
#     """event listener when client connects to the server"""
#     # print(request.sid)
#     # print("client has connected")
#     chatlogs = Chatlog.query.all()
#     chatlog_schema = ChatlogSchema(many=True)
#     output = chatlog_schema.dump(chatlogs)
#     print(output)
#     # emit("connect",{"data":f"id: {request.sid} is connected"})
#     emit("connect", output)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    # print(request.sid)
    print(request.sid, "client has connected")
    # chatlogs = Chatlog.query.all()
    # chatlog_schema = ChatlogSchema(many=True)
    # output = chatlog_schema.dump(chatlogs)
    # print(output)
    emit("connect",f"id: {request.sid} is connected")
    # emit("connect", output)

@socketio.on("enter")
def handle_enter():
    """event listener when client connects to the server"""
    # print(request.sid)
    # print("client has connected")
    chatlogs = Chatlog.query.all()
    chatlog_schema = ChatlogSchema(many=True)
    output = chatlog_schema.dump(chatlogs)
    print("entered")
    # print(output)
    # emit("connect",{"data":f"id: {request.sid} is connected"})
    emit("enter", output)
    

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

@app.route('/', methods=['GET'])
def index():
       return "Flooding24"
 

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
api.add_resource(CCTVSStatus, '/cctvs/status/<cctv_id>')
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
#api.add_resource(AIModel, '/inference/<cctv_id>')
api.add_resource(Bookmarks, '/Bookmark')
api.add_resource(Bookmarks2, '/Bookmark/<M_ID>/<C_ID>')
api.add_resource(FloodHistoryData, '/Data/FloodHistory')
api.add_resource(PostingData, '/Data/Posting')
api.add_resource(CCTVData, '/Data/CCTV')
api.add_resource(Bookmarks3, '/Bookmark/<m_id>')
api.add_resource(ChatlogList, '/Chatlog')

import time
import atexit

def is_raining(cctv_id):
    temperature, humidity, precipitation = getWeather(cctv_id)
    if float(precipitation) > 0:
        return True
    return False

def get_inference(cctv_id):
    response = requests.get("http://15.164.163.248:5000/inference/{}".format(cctv_id))
    info = response.json()
    if info['stage'] == -1:
        print(cctv_id, "에서 -1단계 리턴됨")
        return get_original_stage(cctv_id), ""
    return info['stage'], info['imageURL']

def get_original_stage(cctv_id):
    response = requests.get("http://43.201.149.89:5000/cctvs/status/{}".format(cctv_id))
    info = response.json()
    return info['FloodingStage']

def get_change(original_stage, detected_stage):

    if original_stage == 0 and detected_stage > 0:
        return "침수 발생"

    if original_stage > 0 and detected_stage == 0:
        return "침수 해제"

    if original_stage < detected_stage:
        return "단계 상향"

    if original_stage == detected_stage:
        return None

    if original_stage > detected_stage:
        return "단계 하향"

def need_chatting():
    cctvs = requests.get("http://43.201.149.89:5000/cctvs").json()
    for cctv in cctvs["cctv"]:
        cctv_id = cctv["ID"]
        if get_original_stage(cctv_id) != 0:
            return True
    return False

def is_chatting_open():
    chats = requests.get("http://43.201.149.89:5000/Chatlog").json()
    if len(chats) > 1:
        return True
    return False


def detect_flooding():
    print("in detect_flooding")
    socketio.emit('test', {'test' : 'on detect_flooding'})
    # cctvs = CCTV.query.all()
    cctvs = requests.get("http://43.201.149.89:5000/cctvs").json()
    cnt = 0
    for cctv in cctvs["cctv"]:
        cnt += 1
        socketio.sleep(5)
        print(cnt,cctv["ID"],"##검사중##")
        # socketio.emit('test', {'test' : 'on {}'.format(cctv["ID"])})
        # change, stage = get_change(cctv["ID"])
        # information =  {
        #     'id': cctv["ID"],
        #     'stage': stage,
        #     'change': change
        # }
        # output = json.dumps(information)
        # print(output)
        # socketio.emit("inference",output)
        cctv_id = cctv["ID"]

        if not is_raining(cctv_id):
            original_stage = get_original_stage(cctv_id)
            detected_stage, image_url = get_inference(cctv_id)
            change = get_change(original_stage, detected_stage)

            print(detected_stage, change)
            # socketio.emit("test", {'test' : '{} / {} / {}'.format(original_stage, detected_stage, change)})

            if change != None:
            # addFloodHistory(cctvID, stage, change, imageURL):
                data = {'ID': cctv_id, 'STAGE': detected_stage, 'CHANGE': change, 'URL': image_url}
                res = requests.post("http://43.201.149.89:5000/FloodHistories", data=data)
                # addFloodHistory(cctv_id, detected_stage, change, image_url)
                try:
                    socketio.emit("notification", {'change' : '{}'.format(change)})
                except:
                    print("notification emit error")
                
                # if need_chatting():
                if change == "침수 발생":
                    print("채팅 on")

                    data = {'id': str(datetime.now()), 'user': 'admin', 'body': 'CCTV {} 침수 경보 발생으로 열린 채팅방입니다.'.format(cctv_id), 'time': str(datetime.now())}
                    res = requests.post("http://43.201.149.89:5000/Chatlog", data=data)
                    try:
                        socketio.emit("chatting", {'chatting' : 'on'})
                    except:
                        print("chatting_on emit error")
                    

                elif not need_chatting():
                    print("채팅 off")
                    requests.delete("http://43.201.149.89:5000/Chatlog")

                    data = {'id': str(datetime.now()), 'user': 'admin', 'body': '침수 경보 발생 시 채팅방이 열립니다.', 'time': str(datetime.now())}
                    res = requests.post("http://43.201.149.89:5000/Chatlog", data=data)
                    try:
                        socketio.emit("chatting", {'chatting' : 'off'})
                    except:
                        print("chatting_off emit error")

                    

        else:
            print(cctv["ID"],"--비안옴--")


def test():
    information =  {
                    'id': 123445,
                    'stage': 12312,
                    'change': 123
                }
    output = json.dumps(information)
    socketio.emit('test', output)
    print('test on')

def print_date_time():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))

def forever_thread():
    # This thread should run forever in the background and be able to
    # send messages to all clients every one second
    while True:
        # test()
        socketio.sleep(20)
        detect_flooding()
        

if __name__ == "__main__":
    # app.run(host="0.0.0.0", debug=True, port=5000)
    socketio.start_background_task(forever_thread)
    socketio.run(app, host="0.0.0.0", debug=True, port=5000)
    
