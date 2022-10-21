# CCTV class

from models import db

class CCTV(db.Model):

    # CCTV ID
    ID = db.Column(db.String(7), primary_key=True)
    # CCTV Name
    Name = db.Column(db.String(20), unique=True, nullable=False)
    # Center Name
    Center = db.Column(db.String(20), nullable=False)
    # X COORD
    Longtitude = db.Column(db.Float, nullable=False)
    # Y COORD
    Latitude = db.Column(db.Float, nullable=False)
    # CCTV Streaming URL
    URL = db.Column(db.Text)
