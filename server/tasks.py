# tasks.py
from celery import Celery
import time
import subprocess
BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
app = Celery('tasks', broker=BROKER_URL, backend=CELERY_RESULT_BACKEND)


@app.task
def ffmpeg(m3u8_url, save_dir='.'):
    file_name = str(time.time()).replace('.', '')

    # print(f"#######save to {save_dir}/{file_name}.mp4###########\n")
    try:
        subprocess.run(['ffmpeg', '-t', '5', '-i', m3u8_url, '-bsf:a', 'aac_adtstoasc', '-vcodec', 'copy',
                        '-c', 'copy', '-crf', '50', save_dir + '/' + file_name + '.mp4'])
    except Exception as e:
        print(e)
        print('Exception raised')

    return file_name
