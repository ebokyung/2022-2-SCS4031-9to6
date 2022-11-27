from flask import Flask, abort, jsonify
from flask_restful import reqparse, abort, Api, Resource
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from datetime import timedelta
from sqlalchemy.exc import IntegrityError
from model import db

import sys
from pathlib import Path
from views import s3

from views.cctvAPI import CCTVS, CCTVList
from views.memberAPI import Members, MemberList, MemberCheck, Login, Logout
from views.historyAPI import FloodHistoryList
from views.shelterAPI import Shelters, ShelterList
from views.postingAPI import Postings, PostingList
from views.bookmarkAPI import Bookmarks
from views.bookmarkAPI import Bookmarks2
from views.dataAPI import FloodHistoryData, PostingData, CCTVData
from views.bookmarkAPI import Bookmarks3
from views.modelAPI import AIModel
from tasks import ffmpeg
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


@app.route('/', methods=['GET'])
def index():
       return "Flooding24"


@app.route('/ffmpeg/<url>')
def call_ffmpeg_download(url):
    f = ffmpeg.delay(url)
    return jsonify({'task_id': f.id})


@app.route('/ffmpeg_status/<task_id>')
def get_ffmpeg_task_file_name(task_id):
    task = ffmpeg.AsyncResult(task_id)
    return jsonify({'state': task.state})


@app.route('/ffmpeg_result/<task_id>')
def get_ffmpeg_task_file_name(task_id):
    result = ffmpeg.AsyncResult(task_id).result
    return jsonify({'file_name': result})


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
api.add_resource(PostingList, '/Postings')
api.add_resource(Login, '/Login')
api.add_resource(Logout, '/Logout')
api.add_resource(AIModel, '/inference/<cctv_id>')
api.add_resource(Bookmarks, '/Bookmark')
api.add_resource(Bookmarks2, '/Bookmark/<M_ID>/<C_ID>')
api.add_resource(FloodHistoryData, '/Data/FloodHistory')
api.add_resource(PostingData, '/Data/Posting')
api.add_resource(CCTVData, '/Data/CCTV')
api.add_resource(Bookmarks3, '/Bookmark/<m_id>')


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
