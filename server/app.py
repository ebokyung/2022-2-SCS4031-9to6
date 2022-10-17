from flask import Flask
from models.member import Member
from flask_migrate import Migrate
from models import db
import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.alchemy_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

db.init_app(app)

@app.route('/', methods=['GET'])
def index():
       return "Flooding24"

# Users API Route

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

# @app.route('/users')
# def users():
# 	# users 데이터를 Json 형식으로 반환한다
#     return {"users": [{ "id" : 1, "name" : "AAAA_BE" },
#     					{ "id" : 2, "name" : "BBBB_BE" },
#                         { "id" : 3, "name" : "CCCC_BE" },
#                         { "id" : 4, "name" : "DDDD_BE" }]}
           

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
    