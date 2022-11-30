from flask import jsonify, make_response
from flask_restful import Resource
from model import db
from model.shelter import Shelter, ShelterSchema

class Shelters(Resource):
    def get(self, shelter_index):
        shelter = db.one_or_404(db.select(Shelter).filter_by(Index=shelter_index))
        shelter_schema = ShelterSchema()
        output = shelter_schema.dump(shelter)
        return jsonify({'shelter' : output})

class ShelterList(Resource):

    body = ''
    status_code = 501

    def get(self):
        shelters = Shelter.query.all()
        shelter_schema = ShelterSchema(many=True)
        output = shelter_schema.dump(shelters)
        self.body = jsonify(output)
        self.status_code = 200
        response = (self.body, self.status_code)
        return make_response(response)