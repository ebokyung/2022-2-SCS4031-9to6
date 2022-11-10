import tensorflow as tf
import torch
from Model.object_detection.yolov5.detect import detection_run
import cv2
from Model.data_loader.frame_extraction import get_frame, get_one_frame
import subprocess
import numpy as np
# load both models
# ffmpeg : m3u8 -> mp4 저장 - > 프레임 추출
# object detection inference func
# image classification func

'''
model = self.rosemary_model
model.names[0] = 0 # 'Rosemary'
model.names[1] = 1 # 'Rosemary Leaf Spot'
model.names[2] = 2 # 'Rosemary Pest Damage'
model.names[3] = 3 # 'Rosemary Powdery Mildew'
model.conf = 0.40
model.multi_label = False
model.max_det = 1
image = [img_dir]
disease = model(image, size=416)
disease = np.argmax(disease[-1])
'''


def read_image_from_dir(self, img_dir, input_size=299):
    image = cv2.imread(img_dir)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (input_size, input_size))
    return np.array(image / 255.)


def download_mp4(m3u8_url, save_dir):
    pass


class Inference:
    def __init__(self):
        # load model
        self.binary_model = tf.keras.models.load_model('./image_classification/best.h5')
        self.detection_model = torch.hub.load('ultralytics/yolov5', 'custom', path='./object_detection/best.pt')

    def detection_inference(self, src):
        # dummy
        # TODO
        result = self.detection_model(src)
        if len(result) == 0:
            return False
        else:
            # result에서 가장 많은 빈도수를 보이는 단계를 리턴
            return 1

    def classification_inference(self, src):
        img = read_image_from_dir(src)
        result = self.binary_model(img)
        if result[0][0] >= 0.5: # flood
            return 9
        else: # normal
            return 0

    def run(self, src):
        result = self.detection_inference(src)
        if result is False:
            result = self.classification_inference(src)
        return result
