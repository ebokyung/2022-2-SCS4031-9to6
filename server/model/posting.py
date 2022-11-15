# Posting class

from model import db, ma
from model.member import Member

class Posting(db.Model):

    # Index
    Index = db.Column(db.Integer, primary_key=True)

    # 회원 ID (외래키)
    MemberID = db.Column(db.String(20), db.ForeignKey('member.ID', ondelete='CASCADE'))
    member = db.relationship('Member', backref=db.backref('posting_set'))

    # Address
    Address = db.Column(db.String(100), nullable=False)

    # Datetime - YYYY-MM-DD HH:MM:SS
    Datetime = db.Column(db.DateTime, nullable=False)

    # Image URL - S3에 저장된 이미지 URL
    ImageURL = db.Column(db.Text, nullable=False)

    # Content
    Content = db.Column(db.Text, nullable=False)

    # X COORD
    Longitude = db.Column(db.Float, nullable=False)

    # Y COORD
    Latitude = db.Column(db.Float, nullable=False)


class PostingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Posting
        load_instance = True
        include_fk = True