from flask import jsonify
from flask_restful import Resource
from models import db
from models.member import Member, MemberSchema

# DB에서 '/Members/<member_id>'로 URL쳤을때 해당 멤버 정보 가져오는 부분
class Members(Resource):
	def get(self, member_id):
		member = db.one_or_404(db.select(Member).filter_by(ID=member_id))
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