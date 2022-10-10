from flask import Flask # Flask

app = Flask(__name__)

# Users API Route

@app.route('/users')
def users():
	# users 데이터를 Json 형식으로 반환한다
    return {"users": [{ "id" : 1, "name" : "AAAA" },
    					{ "id" : 2, "name" : "BBBB" },
                        { "id" : 3, "name" : "CCCC" },
                        { "id" : 4, "name" : "DDDD" }]}
           

if __name__ == "__main__":
    app.run(debug = True)
    