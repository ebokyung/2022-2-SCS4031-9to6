# Chat Log class

from model import db, ma

# 채팅 정보

class Chatlog(db.Model):

    # Index
    Index = db.Column(db.Integer, primary_key=True)
    # User
    User = db.Column(db.String(20))
    # Body
    Body = db.Column(db.Text)
    # Time
    Time = db.Column(db.String(20))

class ChatlogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Chatlog
        load_instance = True

