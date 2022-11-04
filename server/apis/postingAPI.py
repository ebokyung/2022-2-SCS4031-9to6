from flask import jsonify, make_response
from flask_restful import Resource
from models import db
from models.posting import Posting, PostingSchema

class Postings(Resource):
    def get(self, posting_index):
        posting = db.one_or_404(db.select(Posting).filter_by(Index=posting_index))
        posting_schema = PostingSchema()
        output = posting_schema.dump(posting)
        return jsonify({'posting' : output})

class PostingList(Resource):

    body = ''
    status_code = 501

    def get(self):    
        postings = Posting.query.all()
        posting_schema = PostingSchema(many=True)
        output = posting_schema.dump(postings)
        self.body = jsonify(output)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response) 