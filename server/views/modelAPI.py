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
from model import db
from model.cctv import CCTV
# from views import s3
# import requests, json

inference = Inference(ROOT / 'temp')


class AIModel(Resource):
    
    def get(self, cctv_id):
        cctv = db.one_or_404(db.select(CCTV).filter_by(Index=cctv_id))
        url = cctv.URL
        stage, imageURL = inference.run(url)
        result = {
            'cctvID': cctv_id,
            'stage': stage,
            'imageURL': imageURL
        }

        return jsonify(result)
