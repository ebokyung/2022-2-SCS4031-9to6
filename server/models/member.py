# 회원 class

from models import db, ma
from datetime import datetime


class Member(db.Model):
    # Member ID
    id = db.Column(db.String(20), primary_key=True)
    # Member Email
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Member Password
    password = db.Column(db.String(100), nullable=False)
    

class MemberSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Member
        load_instance = True