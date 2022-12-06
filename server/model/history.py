# Flood History class

from model import db, ma
from model.cctv import CCTV

class FloodHistory(db.Model):

    # History code(Datetime, CCTV ID) 복합키로 기본키 지정
    __table_args__ = (db.PrimaryKeyConstraint('Datetime', 'CCTVID', name = 'HistoryCode'), )

    # Datetime - YYYY-MM-DD HH:MM:SS
    Datetime = db.Column(db.DateTime, nullable=False)

    # CCTV ID, Name(외래키)
    CCTVID = db.Column(db.String(7), db.ForeignKey('cctv.ID', ondelete='CASCADE'))
    cctv_id = db.relationship('CCTV', foreign_keys='FloodHistory.CCTVID', backref=db.backref('history_set_by_id'))

    CCTVName = db.Column(db.String(20), db.ForeignKey('cctv.Name', ondelete='CASCADE'))
    cctv_name = db.relationship('CCTV', foreign_keys='FloodHistory.CCTVName', backref=db.backref('history_set_by_name'))

    # Flood Stage - 침수 단계
    FloodStage = db.Column(db.Integer, nullable=False)

    # Stage Change - 단계 변경 사항
    StageChange = db.Column(db.String(10), nullable=False)

    # Image URL - S3에 저장된 이미지 URL
    ImageURL = db.Column(db.Text)
    
    # Temperatures - 기온
    Temperature = db.Column(db.Float)

    # Humidity - 습도
    Humidity = db.Column(db.Float)

    # precipitation - 1시간 강수량
    Precipitation = db.Column(db.Float)

class FloodHistorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = FloodHistory
        load_instance = True
        include_fk = True