import sys
import requests
import time
from pathlib import Path

# add ROOT to PATH
FILE = Path(__file__).resolve()
ROOT = FILE.parents[2]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


from Model.inference import Inference
from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from model import db
from model.cctv import CCTV

inference = Inference(ROOT / 'temp')

host = 'http://localhost'
port = '5000'


class AIModel(Resource):
    def get(self, cctv_id):
        cctv = db.one_or_404(db.select(CCTV).filter_by(ID=cctv_id))
        url = cctv.URL

        # download
        call = requests.get('{}:{}/ffmpeg/{}'.format(host, port, url)).json()
        task_id = call['task_id']
        time.sleep(1)
        while True:
            # check download finished
            task_state_req = requests.get('{}:{}/ffmpeg_status/{}'.format(host, port, task_id)).json()
            task_state = task_state_req['state']
            if task_state == 'SUCCESS':
                break

        # filename get
        file_name_req = requests.get('{}:{}/ffmpeg_result/{}'.format(host, port, task_id)).json()
        file_name = file_name_req['file_name']

        stage, imageURL = inference.run(file_name)

        result = {
            'cctvID': cctv_id,
            'stage': stage,
            'imageURL': imageURL
        }

        return jsonify(result)
