#import tensorflow as tf
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

# from Model.object_detection.yolov5.detect import detection_run
# from Model.data_loader.frame_extraction import get_frame, get_one_frame

# TODO
# delete url
dummy_url = 'http://210.179.218.52:1935/live/157.stream/playlist.m3u8'
file_name = ''


def raise_sigint():
    """
    Raising the SIGINT signal in the current process and all sub-processes.

    os.kill() only issues a signal in the current process (without subprocesses).
    CTRL+C on the console sends the signal to the process group (which we need).
    """
    if hasattr(signal, 'CTRL_C_EVENT'):
        # windows. Need CTRL_C_EVENT to raise the signal in the whole process group
        os.kill(os.getpid(), signal.CTRL_C_EVENT)
    else:
        # unix.
        pgid = os.getpgid(os.getpid())
        if pgid == 1:
            os.kill(os.getpid(), signal.SIGINT)
        else:
            os.killpg(os.getpgid(os.getpid()), signal.SIGINT)


def ffmpeg(m3u8_url, save_dir):
    global file_name
    file_name = str(time.time()).replace('.', '') + '.mp4'
    try:
        subprocess.run(['ffmpeg', '-i', m3u8_url, '-bsf:a', 'aac_adtstoasc', '-vcodec', 'copy',
                        '-c', 'copy', '-crf', '50', save_dir + '/' + file_name])
    except Exception as e:
        print('done')


def download_mp4(m3u8_url, save_dir='.'):
    if __name__ == '__main__':
        process = Process(target=ffmpeg, args=(m3u8_url, save_dir))
        process.start()
        time.sleep(1)
        try:
            raise_sigint()
        except:
            print('done!')


def read_image_from_dir(img_dir, input_size=299):
    image = cv2.imread(img_dir)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (input_size, input_size))
    return image / 255.


class Inference:
    def __init__(self, base_dir):
        # load model
        self.binary_model = tf.keras.models.load_model('./image_classification/best.h5')
        self.detection_model = torch.hub.load('ultralytics/yolov5', 'custom', path='./object_detection/best.pt')
        self.base_dir = base_dir

    def detection_inference(self, src):
        # dummy
        # TODO
        result = self.detection_model(src)

        if len(result) == 0:
            # no detection 이면
            return False
        else:
            # result에서 가장 많은 빈도수를 보이는 단계를 리턴
            return 1

    def classification_inference(self, src):
        img = read_image_from_dir(src)
        result = self.binary_model(img)
        if result[0][0] >= 0.5:  # flood
            return 9
        else:  # normal
            return 0

    def run(self, url):
        # TODO
        download_mp4(url, self.base_dir)
        result = self.detection_inference(self.base_dir+'/'+file_name)
        if result is False:
            # no detection 일때 binary detection
            src = read_image_from_dir(file_name)
            src = np.array(src)
            result = self.classification_inference(src)
        # 0 : 정상
        # 1,2,3(object detection) : n단계
        # 9 (binary classification) : 침수
        return result
