# 회원 class

from model import db, ma
from datetime import datetime


class Member(db.Model):
    # Member ID
    ID = db.Column(db.String(20), primary_key=True)
    # Member Email
    Email = db.Column(db.String(120), unique=True, nullable=False)
    # Member Password
    Password = db.Column(db.String(100), nullable=False)
    

class MemberSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Member
        load_instance = True