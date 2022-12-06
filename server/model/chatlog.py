# Chat Log class

from model import db, ma

# 채팅 정보

class Chatlog(db.Model):
 
    # Index
    id = db.Column(db.String(30), primary_key=True)
    # User
    user = db.Column(db.String(20))
    # Body
    body = db.Column(db.Text)
    # Time - YYYY-MM-DD HH:MM:SS
    time = db.Column(db.DateTime)

class ChatlogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Chatlog
        load_instance = True

