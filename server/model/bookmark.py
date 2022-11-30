from model import db, ma
from model.member import Member
from model.cctv import CCTV


class Bookmark(db.Model):
    # 복합키로 기본키 지정
    __table_args__ = (db.PrimaryKeyConstraint('memberID', 'cctvID', name='_bookmark_'),)

    # Member ID
    memberID = db.Column(db.String(20), db.ForeignKey('member.ID', ondelete='CASCADE'), nullable=False)
    member = db.relationship('Member', backref=db.backref('member_set'))

    # CCTV ID
    cctvID = db.Column(db.String(7), db.ForeignKey('cctv.ID', ondelete='CASCADE'), nullable=False)
    cctv = db.relationship('CCTV', backref=db.backref('cctv_set'))
    
    cctvName = db.Column(db.String(30), nullable=False)
    
    URL = db.Column(db.String(500), nullable=False)


class BookmarkSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Bookmark
        load_instance = True
        include_fk = True