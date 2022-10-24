from flask import Flask, abort, jsonify
from flask_restful import reqparse, abort, Api, Resource
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from models import db
from models.member import Member, MemberSchema
from models.cctv import CCTV, CCTVSchema
import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.alchemy_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_AS_ASCII'] = False

migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

@app.route('/', methods=['GET'])
def index():
       return "Flooding24"

class CCTVS(Resource):
	def get(self, cctv_id):
		cctv = db.one_or_404(db.select(CCTV).filter_by(id=cctv_id))
		cctv_schema = CCTVSchema()
		output = cctv_schema.dump(cctv)
		return jsonify({'cctv' : output})

class CCTVList(Resource):
	def get(self):
		cctvs = CCTV.query.all()
		cctv_schema = CCTVSchema(many=True)
		output = cctv_schema.dump(cctvs)
		return jsonify({'cctv' : output})

# DB에서 '/Members/<member_id>'로 URL쳤을때 해당 멤버 정보 가져오는 부분
class Members(Resource):
	def get(self, member_id):
		member = db.one_or_404(db.select(Member).filter_by(id=member_id))
		member_schema = MemberSchema()
		output = member_schema.dump(member)
		return jsonify({'member' : output})

# '/Members'로 URL쳤을 때 전체 멤버 정보 가져오는 부분
class MemberList(Resource):
	def get(self):
		members = Member.query.all()
		member_schema = MemberSchema(many=True)
		output = member_schema.dump(members)
		return jsonify({'member' : output})

# 회원가입 중복체크하는 부분
class MemberCheck(Resource):
    def get(self, member_id): # member_id로 인풋받음
        # members = Member.query.get(id)
        already_exist = Member.query.filter_by(ID=member_id).first() #이미 DB에 해당 ID가 존재하는지 확인
        if already_exist:
            return False # 가입하려는 ID가 이미 DB에 존재하면 가입이 안되는거니까 False 리턴.
        else:
            return True # 가입하려는 ID가 DB에 없으면 회원가입 가능하므로 True 리턴.
        
        

# Users API Route
api.add_resource(CCTVS, '/cctvs/<cctv_id>')
api.add_resource(CCTVList, '/cctvs')
api.add_resource(Members, '/Members/<member_id>')
api.add_resource(MemberList, '/Members')
api.add_resource(MemberCheck, '/MembersCheck/<member_id>')


# @app.route('/Members/<int:id>', methods=['GET'])
# def get_member(id):
# 	member = Member.query.get(id)
# 	if not member:
# 		return abort(404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)