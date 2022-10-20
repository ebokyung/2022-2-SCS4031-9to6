# 회원 class

from models import db
from datetime import datetime


class Member(db.Model):
    id = db.Column(db.String(20), primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)