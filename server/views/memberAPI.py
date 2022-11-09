import json
import bcrypt, jwt
from flask import Response, jsonify, make_response, redirect, url_for, session
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from models import db
from models.member import Member, MemberSchema

# DB에서 '/Members/<member_id>'로 URL쳤을때 해당 멤버 정보 가져오는 부분
class Members(Resource):
	def get(self, member_id):
		member = db.one_or_404(db.select(Member).filter_by(ID=member_id))
		member_schema = MemberSchema()
		output = member_schema.dump(member)
		return jsonify({'member' : output})

# '/Members'로 URL쳤을 때 전체 멤버 정보 가져오고 회원가입 정보 저장하는 부분
class MemberList(Resource):
    
    parser = reqparse.RequestParser()
    parser.add_argument('ID', required=True, type=str, help="MEMBER ID", location='json')
    parser.add_argument('Password', required=True, type=str, help="MEMBER Password", location='json')
    parser.add_argument('Email', required=True, type=str, help="MEMBER Email", location='json')
    
    body = ''
    status_code = 501
    
    
    def get(self):
        members = Member.query.all()
        member_schema = MemberSchema(many=True)
        output = member_schema.dump(members)
        return jsonify({'member' : output})

    def post(self):
        args = self.parser.parse_args()
        memberID = args['ID']
        memberPW = args['Password']
        memberEMAIL = args['Email']
        
        try:
            addMemberInfo(memberID, memberPW, memberEMAIL)
            query = Member.query.get(memberID)
            schema = MemberSchema()
            self.body = jsonify(schema.dump(query))
            self.status_code = 201

        except IntegrityError as error:
            db.session.rollback()
            error_message = str(error)
            self.body = jsonify({"error": str(error), "type": "IntegrityError"})
            if "Duplicate entry123" in error_message:
                self.status_code = 409
            else:
                self.status_code = 400

        finally:
            response = (self.body, self.status_code)
            response = make_response(response)

        return response



def addMemberInfo(memberID, memberPW, memberEMAIL):
    # 멤버 객체 생성 (왼쪽편은 워크벤치 DB의 컬럼명이랑 같아야함)
    memberINFO = Member(
        ID = memberID,
        Password = memberPW,
        Email = memberEMAIL
    )

    # 테이블에 객체 저장
    db.session.add(memberINFO)
    db.session.commit()
    


# 회원가입 중복체크하는 부분
class MemberCheck(Resource):
    def get(self, member_id): # member_id로 인풋받음
        # members = Member.query.get(id)
        already_exist = Member.query.filter_by(ID=member_id).first() #이미 DB에 해당 ID가 존재하는지 확인
        if already_exist:
            return False # 가입하려는 ID가 이미 DB에 존재하면 가입이 안되는거니까 False 리턴.
        else:
            return True # 가입하려는 ID가 DB에 없으면 회원가입 가능하므로 True 리턴.
        
class Test(Resource):
    def get(self):
        members = Member.query.all()
        member_schema = MemberSchema(many=True)
        output = member_schema.dump(members)
        return output


# 로그인
class Login(Resource):
    status_code = 501
    parser = reqparse.RequestParser()
    parser.add_argument('ID', required=True, type=str, location='json')
    parser.add_argument('Password', required=True, type=str, location='json')
    
    # def get(self):
    #     members = Member.query.all()
    #     member_schema = MemberSchema(many=True)
    #     output = member_schema.dump(members)
    #     return jsonify({'member' : output})
    
    def post(self):
        args = self.parser.parse_args()
        id_temp = args['ID']
        pw_temp = args['Password']


        try:
            data = Member.query.filter_by(ID = id_temp, Password = pw_temp).first()
            if data is not None:
                hashedcode = jwt.encode({'ID': id_temp}, "secret", algorithm="HS256")
                session['name'] = hashedcode
                resp = make_response({
                    'Authorization': hashedcode
                }, 200)
                resp.headers["Authorization"] = hashedcode
                return resp
            else:
                return {
                    "message": "Login Failed"
                }, 403
        except:
            return {
                "message": "Unknown Error"
            }, 500
            
        # members = Member.query.all()
        # member_schema = MemberSchema(many=True)
        # output = member_schema.dump(members)
        # output = json.dumps(output1)    
        # if id_temp not in output:
        #     return {
        #         "message": "User Not Found"
        #     }, 404
        # elif not bcrypt.checkpw(pw_temp.encode('utf-8'), pw_temp):  # 비밀번호 일치 확인
        #     return {
        #         "message": "Auth Failed"
        #     }, 500
        # elif pw_temp not in output:  # 비밀번호 일치 확인
        #     return {
        #         "message": "Auth Failed"
        #     }, 500
        # else:
        #     return {
        #         'Authorization': jwt.encode({'Password': pw_temp}, "secret", algorithm="HS256") # str으로 반환하여 return
        #     }, 200

        # if Member.query.get(id_temp) == None:
        #     로그인 실패
        # elif Member.query.get(id_temp):
        #     로그인 성공 -> 토큰
            
        # if (id_temp == Member.query.get(id_temp)):
        # if (id_temp in Member):
        #     if (pw_temp in Member):
        #         db.session['ID'] = id_temp
                
        #         self.status_code = 200
        #         response = self.status_code
        #         return make_response(response)


# 로그인1
class Login1(Resource):
    def post(self, member_id, member_pw):
        
        id_list = Member.query.get(member_id)
        pw_list = Member.query.get(member_pw)
        
        
        # 1번째
        if (member_id in id_list):
            nth =  id_list.index()
            if (member_pw in pw_list):
                nnth = pw_list.index()
                if nth == nnth:
                    db.session['ID'] = member_id
                    return redirect(url_for('/main'))
        else:
            return redirect(url_for('/login'))
        
        
        # 2번째
        if (member_id in id_list):
            return id_list.index()
        
        if (member_pw in pw_list):
            return pw_list.index()
        
        if id_list.index() == pw_list.index():
            db.session['ID'] = member_id
            return redirect(url_for('/main'))
        
        
        # 3번째
        if (member_id in id_list) and (member_pw in pw_list):
            db.session['ID'] = member_id
        
        return redirect(url_for('/main'))
        
        
# 로그인 2
class index(Resource):
    def post(self):
        if Resource in db.session['ID']:  # session안에 username이 있으면 로그인
            return redirect(url_for('/main'))
        
class Login2(Resource):
    def post(self, member_id, member_pw):
        
        id_list = Member.query.get(member_id)
        pw_list = Member.query.get(member_pw)
        
        if (member_id in id_list):
            nth =  id_list.index()
            if (member_pw in pw_list):
                nnth = pw_list.index()
                if nth == nnth:
                    db.session['ID'] = member_id
                    return index(member_id)
        else:
            return redirect(url_for('/login'))
        

# db.Member.find_one({'ID': id_receive, 'Password': pw_receive})
# test 로그인
class testlog(Resource):
    status_code = 501
    
    def post(self):
        dd = "kiho7248"
        db.session['ID'] = dd
        return jsonify({'ID':db.session['ID']})
        
# 로그아웃
class Logout(Resource):
    status_code = 501
    def post(self):
        session.pop ('name', None)
        self.status_code = 200
        response = self.status_code
        return response
        # db.session['ID'].clear()
        # db.session.pop('ID', None) 바로위에꺼 아니면 이거일듯
        # return redirect(url_for('/login'))
        # self.status_code = 200
        # response = self.status_code
        # return make_response(response)
    
