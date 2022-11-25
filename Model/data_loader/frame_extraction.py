import cv2


# Frame Extraction
def get_frame(video_path, save_dir):
    video = cv2.VideoCapture(video_path)
    video_name = video_path.split('/')[-1]
    if not video.isOpened():
        print("Could not Open :", video_name)
        exit(0)

    #     length = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    #     width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    #     height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = video.get(cv2.CAP_PROP_FPS)

    #     print("length :", length)
    #     print("width :", width)
    #     print("height :", height)
    print("fps :", fps)

    count = 0
    while video.isOpened():
        ret, image = video.read()
        #         if int(video.get(1)) % 20 == 0 :
        if int(video.get(1)) % round(fps) * 5 == 0:  # 앞서 불러온 fps 값을 사용하여 1초마다 추출
            try:
                print('Saved frame number :', str(int(video.get(1))))
                cv2.imwrite(save_dir + "/frame{}_{}.jpg".format(count, video_name), image)
                print('Saved frame%d.jpg' % count)
                count += 1
            except Exception as e:
                print(e)
                print(image)
        if ret is False:
            break

    video.release()


def get_one_frame(video_path, save_dir='.'):
    video = cv2.VideoCapture(video_path)

    if not video.isOpened():
        print("Could not Open :", video_path)
        exit(0)

    ret, image = video.read()
    try:
        file_name = video_path.split('/')[-1].split('.')[0]
        cv2.imwrite(save_dir + "/{}.jpg".format(file_name), image)
    except Exception as e:
        video.release()
        print('Some thing wrong!')
        print(e)

    video.release()


