from flask import jsonify, make_response, session
from flask_restful import Resource, reqparse
from sqlalchemy.exc import IntegrityError
from models import db
from models.bookmark import Bookmark, BookmarkSchema



class Bookmarks(Resource):
    
    parser = reqparse.RequestParser()
    parser.add_argument('memberID1', required=True, type=str, help="MEMBER ID", location='json')
    parser.add_argument('cctvID1', required=True, type=str, help="CCTV ID", location='json')
    
    body = ''
    status_code = 501
    
    
    def get(self):
        bookmark = Bookmark.query.all()
        bookmark_schema = BookmarkSchema(many=True)
        output = bookmark_schema.dump(bookmark)
        return jsonify({'Bookmark' : output})

    def post(self):
        args = self.parser.parse_args()
        memberID2 = args['memberID1']
        cctvID2 = args['cctvID1']
        
        try:
            addBookmarkInfo(memberID2, cctvID2)
            query = Bookmark.query.get((memberID2, cctvID2))
            schema = BookmarkSchema()
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


def addBookmarkInfo(memberID2, cctvID2):
    # 멤버 객체 생성 (왼쪽편은 워크벤치 DB의 컬럼명이랑 같아야함)
    bookmarkINFO = Bookmark(
        memberID = memberID2,
        cctvID = cctvID2,
    )

    # 테이블에 객체 저장
    db.session.add(bookmarkINFO)
    db.session.commit()