from flask import Flask, abort, jsonify
from flask_restful import reqparse, abort, Api, Resource
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from datetime import timedelta

from models import db
from views import s3

from views.cctvAPI import CCTVS, CCTVList
from views.memberAPI import Members, MemberList, MemberCheck, Login, Logout, Test
from views.historyAPI import FloodHistoryList
from views.shelterAPI import Shelters, ShelterList
 
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


@app.route('/', methods=['GET'])
def index():
       return "Flooding24"        

# Users API Route
api.add_resource(CCTVS, '/cctvs/<cctv_id>')
api.add_resource(CCTVList, '/cctvs')
api.add_resource(Members, '/Members/<member_id>')
api.add_resource(MemberList, '/Members')
api.add_resource(MemberCheck, '/MembersCheck/<member_id>')
api.add_resource(FloodHistoryList, '/FloodHistories')
api.add_resource(Shelters, '/Shelters/<shelter_index>')
api.add_resource(ShelterList, '/Shelters')
api.add_resource(Login, '/Login')
api.add_resource(Logout, '/Logout')


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
