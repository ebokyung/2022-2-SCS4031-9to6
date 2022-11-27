# tasks.py
from celery import Celery
import time
import subprocess
from pathlib import Path

BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
app = Celery('tasks', broker=BROKER_URL, backend=CELERY_RESULT_BACKEND)

FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]

@app.task
def ffmpeg(m3u8_url):
    file_name = str(time.time()).replace('.', '')

    # print(f"#######save to {save_dir}/{file_name}.mp4###########\n")
    try:
         # ffmpeg -i http://stream/playlist.m3u8 -vframes 1 -q:v 2 output.jpg
        subprocess.run(['ffmpeg', '-i', m3u8_url, '-vframes', '1', '-q:v', '2',
                         str(ROOT) + '/temp/' + file_name + '.jpg'])
    except Exception as e:
        print(e)
        print('Exception raised')

    return file_name
