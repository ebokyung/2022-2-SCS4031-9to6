import sys
from pathlib import Path

# add ROOT to PATH
FILE = Path(__file__).resolve()
ROOT = FILE.parents[2]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


from Model.inference import Inference
from flask import jsonify, make_response
from flask_restful import Resource, reqparse
# from sqlalchemy.exc import IntegrityError
from models import db
from models.cctv import CCTV
# from views import s3
# import requests, json

inference = Inference(ROOT / 'temp')


class DLModel(Resource):
    def get(cctvID):
        cctv = db.one_or_404(db.select(CCTV).filter_by(Index=cctvID))
        url = cctv.URL
        stage, imageURL = inference.run(url)
        result = {
            'cctvID': cctvID,
            'stage': stage,
            'imageURL': imageURL
        }

        return jsonify(result)
