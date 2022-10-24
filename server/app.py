from flask import Flask, abort, jsonify
from flask_restful import reqparse, abort, Api, Resource
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from models import db
from models.member import Member
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
		cctv = db.one_or_404(db.select(CCTV).filter_by(ID=cctv_id))
		cctv_schema = CCTVSchema()
		output = cctv_schema.dump(cctv)
		return jsonify({'cctv' : output})

class CCTVList(Resource):
	def get(self):
		cctvs = CCTV.query.all()
		cctv_schema = CCTVSchema(many=True)
		output = cctv_schema.dump(cctvs)
		return jsonify({'cctv' : output})

# Users API Route
api.add_resource(CCTVS, '/cctvs/<cctv_id>')
api.add_resource(CCTVList, '/cctvs')

@app.route('/Members/<int:id>', methods=['GET'])
def get_member(id):
	member = Member.query.get(id)
	if not member:
		return abort(404)

	return jsonify({
		'ID': member.id,
		'e-mail': member.email,
		'password': member.password,
	})

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
    