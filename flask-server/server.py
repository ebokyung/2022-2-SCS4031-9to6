from flask import Flask # Flask

app = Flask(__name__)

@app.route('/')
def welcome():
       return "Welcome. Hosting from EC2"

# Users API Route

@app.route('/users')
def users():
	# users 데이터를 Json 형식으로 반환한다
    return {"users": [{ "id" : 1, "name" : "AAAA_BE" },
    					{ "id" : 2, "name" : "BBBB_BE" },
                        { "id" : 3, "name" : "CCCC_BE" },
                        { "id" : 4, "name" : "DDDD_BE" }]}
           

if __name__ == "__main__":
    app.run(debug = True)
    