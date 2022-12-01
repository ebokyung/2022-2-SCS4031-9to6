# Chat Log class

from model import db, ma

# 채팅 정보

class Chatlog(db.Model):

    # Index
    id = db.Column(db.Integer, primary_key=True)
    # User
    user = db.Column(db.String(20))
    # Body
    body = db.Column(db.Text)
    # Time
    time = db.Column(db.String(20))

class ChatlogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Chatlog
        load_instance = True

