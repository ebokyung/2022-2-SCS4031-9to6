# Shelter class

from models import db, ma

# 대피소 정보

class Shelter(db.Model):

    # Index
    Index = db.Column(db.Integer, primary_key=True)
    # Shelter Address
    Address = db.Column(db.String(100), nullable=False)
    # Shelter Name
    Name = db.Column(db.String(50), nullable=False)
    # Shelter Type
    Type = db.Column(db.String(4))
    # Shelter Area
    Area = db.Column(db.Integer)
    # X COORD
    Longitude = db.Column(db.Float, nullable=False)
    # Y COORD
    Latitude = db.Column(db.Float, nullable=False)

class ShelterSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Shelter
        load_instance = True