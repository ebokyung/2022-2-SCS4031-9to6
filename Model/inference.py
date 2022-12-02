import tensorflow as tf
import glob

import torch
import cv2
import subprocess
import numpy as np
import time
import signal
import os
from multiprocessing import Process
from pathlib import Path
import sys

FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from Model.object_detection.detect import detection_run
from Model.data_loader.frame_extraction import get_one_frame
from Model.object_detection.models.common import DetectMultiBackend
from Model.object_detection.utils.torch_utils import select_device
from server.views import s3
from server.views.utils import s3_upload_file

# delete url
dummy_url = 'http://210.179.218.52:1935/live/157.stream/playlist.m3u8'


def read_image_from_dir(img_dir, input_size=299):
    try:
        image = cv2.imread(img_dir)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (input_size, input_size))
        return image / 255.
    except:
        return False


class Inference:
    def __init__(self, base_dir='.'):
        # load model
        self.binary_model = tf.keras.models.load_model(ROOT / 'Model/image_classification/best.h5')
        print("TF Model Loaded!")

        device = select_device()
        self.detection_model = DetectMultiBackend(ROOT / 'Model/object_detection/best.pt', device=device)
        self.detection_model.names[0] = '0stage'
        self.detection_model.names[1] = '1stage'
        self.detection_model.names[2] = '2stage'
        self.detection_model.names[3] = '3stage'
        print("Torch Model Loaded!")

        self.base_dir = str(base_dir)
        if not os.path.isdir(self.base_dir):
            os.mkdir(self.base_dir)

    def detection_inference(self, src):
        # dummy
        result = detection_run(
            model=self.detection_model,
            source=src,  # file/dir/URL/glob/screen/0(webcam)
            imgsz=(640, 640),  # inference size (height, width)
            conf_thres=0.4,  # confidence threshold
            iou_thres=0.45,  # NMS IOU threshold
            max_det=1000,  # maximum detections per image
            view_img=False,  # show results
            save_txt=False,  # save results to *.txt
            save_conf=False,  # save confidences in --save-txt labels
            nosave=True,  # do not save images/videos
            classes=None,  # filter by class: --class 0, or --class 0 2 3
            agnostic_nms=False,  # class-agnostic NMS
            augment=False,  # augmented inference
            visualize=False,  # visualize features
            update=False,  # update all models
            project='./runs/detect',  # save results to project/name
            name='exp',  # save results to project/name
            exist_ok=False,  # existing project/name ok, do not increment
        )

        if len(result) == 0:
            # no detection 이면
            return False
        else:
            # result에서 가장 많은 빈도수를 보이는 단계를 리턴
            values = np.array(list(result.values()))
            idx = np.where(values == max(values))
            final_result = ''
            keys = list(result.keys())
            for i in idx[0]:
                final_result = max(final_result, keys[i])
            return int(final_result[0])

    def classification_inference(self, src):
        img = read_image_from_dir(src)
        img = np.array([img])
        result = self.binary_model.predict(img)
        if result[0][0] >= 0.5:  # flood
            return 9
        else:  # normal
            return 0

    def run(self, file_name):
        img_name = file_name + '.jpg'
        img_src = self.base_dir + '/' + img_name

        # execute inference
        # torch model
        result = self.detection_inference(img_src)

        if result is False:
            # no detection 일때 binary detection
            result = self.classification_inference(img_src)
            # result = 9

        # image S3 저장
        image_url = ''
        if result != 0:
            # 판단결과 침수일때, 이미지 저장
            i = 0
            while True:
                s3_uploaded = s3_upload_file(s3, '9to6bucket', img_src, f'Flood/{img_name}')
                if s3_uploaded:
                    image_url = 'https://{bucket_name}.s3.{location}.amazonaws.com/Flood/{s3_path}'.format(
                        bucket_name='9to6bucket',
                        location='ap-northeast-2',
                        s3_path=img_name)
                    break
                else:
                    # s3에 이미지 저장 3번까지 시도
                    i += 1
                    print('image upload failed, Retry upload image {} times'.format(i))
                    if i >= 3:
                        print('image upload failed...T,T')
                        break

    
        os.remove(img_src)

        # 0 : 정상
        # 1,2,3(object detection) : n단계
        # 9 (binary classification) : 침수
        return result, image_url
