# CCTV class

from model import db, ma

# CCTV 정보

class CCTV(db.Model):

    # CCTV ID
    ID = db.Column(db.String(7), primary_key=True)
    # CCTV Name
    Name = db.Column(db.String(20), unique=True, nullable=False)
    # Center Name
    Center = db.Column(db.String(20), nullable=False)
    # X COORD
    Longitude = db.Column(db.Float, nullable=False)
    # Y COORD
    Latitude = db.Column(db.Float, nullable=False)
    # CCTV Streaming URL
    URL = db.Column(db.Text)

class CCTVSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CCTV
        load_instance = True

# CCTV 상태        

class CCTVStatus(db.Model):

    # CCTV ID(외래키) 
    CCTVID = db.Column(db.String(7), db.ForeignKey('cctv.ID', ondelete='CASCADE'), primary_key=True)
    cctv = db.relationship('CCTV', backref=db.backref('status'))

    # 침수 단계
    FloodingStage = db.Column(db.Integer, nullable=False)

class CCTVStatusSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CCTVStatus
        load_instance = True
        include_fk = True


