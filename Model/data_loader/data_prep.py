import pandas as pd
import time, os, socket, threading, shutil, cv2
import matplotlib.pyplot as plt
from glob import glob
from urllib.request import urlretrieve
from urllib.error import HTTPError, URLError
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import \
ElementClickInterceptedException, NoSuchElementException, ElementNotInteractableException
from pytube import Playlist, YouTube
from moviepy.video.VideoClip import * ## moviepy<=1.0.2
from moviepy.audio.AudioClip import *
from moviepy.editor import *


# image data
class GoogleCrawling:
    # 출처 : https://youtu.be/pQ7dOg9c4NI
    def __init__(self):
        self.chromedriver_path = '../chromedriver/chromedriver'
        socket.setdefaulttimeout(30)
        self.driver = webdriver.Chrome(self.chromedriver_path)
        self.scraped_count = 0

        # 이미지 크롤링 키워드 기록
        self.query_list = ['flooding', 'flooding road', '강남역 침수', '침수',
                      '道路浸水', '車の洪水',  # 중국어, 일본어 (도로침수, 차 침수)
                      'Überschwemmungen auf der Straße',  # 독일어, 도로 침수
                      'inondation des routes',  # 프랑스어, 도로 침수
                      'inundación de coches',  # 스페인어, 차 침수
                      'flooded', '침수 cctv',
                      ### 자동차 포커스 키워드
                      'flooded car',
                      'überflutetes Auto',  # 독일어
                      '被淹的车',  # 중국어
                      'coche inundado',  # 스페인어
                      'voiture inondée',  # 프랑스어
                      ]

    def create_folder(self, directory):
        try:
            if not os.path.exists(directory):
                os.makedirs(directory)
        except OSError:
            print('Error: Creating directory. ' + directory)


    def scroll_down(self):
        scroll_count = 0
        print("[scroll_down() : 스크롤 다운 시작]")

        last_height = self.driver.execute_script('return document.body.scrollHeight')
        after_click = False
        after_click_exception_span = False
        while True:
            print(f"[스크롤 다운: {scroll_count}]")
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            scroll_count += 1
            time.sleep(1)

            new_height = self.driver.execute_script('return document.body.scrollHeight')

            if last_height == new_height:
                try:
                    if self.driver.find_element('xpath', '//*[@id="islmp"]/div/div/div/div[2]/span') != 0:
                        more_span = self.driver.find_element('xpath', '//*[@id="islmp"]/div/div/div/div[2]/span')
                        more_span.click()
                        print('고약한 구글')
                except NoSuchElementException as e:
                    print(e)

                if after_click is True:
                    break
                else:
                    try:
                        more_button = self.driver.find_element('xpath',
                                                          '//*[@id="islmp"]/div/div/div/div[1]/div[2]/div[2]/input')
                        if more_button.is_displayed():
                            more_button.send_keys(Keys.ENTER)
                            after_click = True

                    except NoSuchElementException as e:
                        # scroll button이 없을때
                        print(e)
                        break
            last_height = new_height


    def click_and_save(self, dir_name, index, img, img_list_length):
        global scraped_count

        try:
            img.click()
            self.driver.implicitly_wait(5)  # 5초 기다림
            xpath = '//*[@id="Sva75c"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[3]/div/a/img'
            src = self.driver.find_element('xpath', xpath).get_attribute('src')
            #         src = driver.find_element(By.CSS_SELECTOR, '.n3VNCb.KAlRDb').get_attribute('src')
            if src.split('.')[-1] == 'png':
                urlretrieve(src, dir_name + '/' + str(scraped_count + 1) + ".png")
                print(f"{index + 1}/{img_list_length} PNG 이미지 저장")
            else:
                urlretrieve(src, dir_name + '/' + str(scraped_count + 1) + ".jpg")
                print(f"{index + 1}/{img_list_length} JPG 이미지 저장")

            scraped_count += 1
        except HTTPError as e:
            print(e)
        except Exception as e:
            print(e)
            return


    def scraping(self, dir_name, query):
        global scraped_count

        url = f"https://www.google.com/search?q={query}&tbm=isch&ved=2ahUKEwi037baoc76AhVEyIsBHQnWDywQ2-cCegQIABAA&oq=f&gs_lcp=CgNpbWcQARgAMgQIIxAnMgQIIxAnMggIABCABBCxAzIFCAAQgAQyCAgAEIAEELEDMgUIABCABDIICAAQgAQQsQMyBQgAEIAEMgUIABCABDIFCAAQgARQxwJYxwJggxJoAHAAeACAAYYBiAHhAZIBAzEuMZgBAKABAaoBC2d3cy13aXotaW1nwAEB&sclient=img&ei=4C5AY7TvMMSQr7wPiay_4AI&bih=969&biw=1920&rlz=1C5CHFA_enKR1026KR1026#imgrc=X6d1rGBwHMhXsM"
        self.driver.get(url)
        self.driver.maximize_window()

        self.scroll_down()
        print('[스크롤 완료]')
        self.driver.execute_script("window.scrollTo(0, 0)")

        div = self.driver.find_element('xpath', '//*[@id="islrg"]/div[1]')
        img_list = div.find_elements(By.CSS_SELECTOR, ".rg_i.Q4LuWd")
        #     img_list = div.find_elements('xpath', '//*[@id="islrg"]/div[1]/div[1]/a[1]/div[1]/img')
        print(len(img_list))
        img_list_length = len(img_list)
        #######################################################################################

        for index, img in enumerate(img_list):
            try:
                self.click_and_save(dir_name, index, img, img_list_length)
            except ElementClickInterceptedException as e:
                print(e)
                self.driver.execute_script("window.scrollTo(0, window.scrollY+100)")
                self.click_and_save(dir_name, index, img, img_list_length)
            except NoSuchElementException as e:
                print(e)
                self.driver.execute_script("window.scrollTo(0, window.scrollY+100)")
                self.click_and_save(dir_name, index, img, img_list_length)
            except ConnectionResetError as e:
                print(e)
                pass
            except URLError as e:
                print(e)
                pass
            except socket.timeout as e:
                print(e)
                pass
            except socket.gaierror as e:
                print(e)
                pass
            except ElementNotInteractableException as e:
                print(e)
                break

        try:
            print("[스크래핑 종료 (성공률: {:.2f})]".format((scraped_count / img_list_length) * 100))
        except ZeroDivisionError as e:
            print(e)

        self.driver.quit()


    def resize_and_remove(self, dir_name, query, filter_size):
        # 일정 해상도 이하이거나 손상된 이미지 제거
        filtered_count = 0

        for index, file_name in enumerate(os.listdir(dir_name)):
            try:
                file_path = os.path.join(dir_name, file_name)
                img = cv2.imread(file_path)
                height = img.shape[0]
                width = img.shape[1]
                if height >= width > 512:
                    img = cv2.resize(img, (512, int(512 / height * width)), interpolation=cv2.INTER_AREA)
                    cv2.imwrite(file_path, img)
                    print(file_path, ' resized')
                elif width > height > 512:
                    img = cv2.resize(img, dsize=(int(512 / width * height), 512), interpolation=cv2.INTER_AREA)
                    cv2.imwrite(file_path, img)
                    print(file_path, ' resized')

            except OSError as e:
                print(e)
                os.remove(file_path)
                filtered_count += 1
            except AttributeError as e:
                print(e)
                os.remove(file_path)
                filtered_count += 1
            except TypeError as e:
                print(e)
                print(img.shape)
        print(f"[이미지 제거 개수: {filtered_count}/{scraped_count}]")

    def run(self, keyword):
        self.scraped_count = 0

        path = '../data/binary/'
        dir_name = path + keyword
        self.create_folder(dir_name)
        print(f"[{dir_name} 디렉토리 생성]")

        self.scraping(dir_name, keyword)
        print('##################### 크롤링 끝 #############################')
        # resize_and_remove(dir_name, query, 512)


# video data
class YoutubeCrawling:
    # 출처: https://butnotforme.tistory.com/entry/파이썬으로-유튜브-고화질-영상-다운로드-하기 [butnotforme:티스토리]
    def __init__(self):
        self.fpath = lambda x: '../data/' + x
        self.output_path = '../data/youtube'

    def ydown(self, url: str, prefix: str = ""):
        yt = YouTube(url)
        # yt.streams.filter(adaptive=True, file_extension="mp4", only_video=True).order_by("resolution").desc().first().download(output_path=output_path, filename_prefix=f"{prefix} ")

        vpath = (
            yt.streams.filter(adaptive=True, file_extension="mp4", only_video=True)
            .order_by("resolution")
            .desc()
            .first()
            .download(output_path=self.fpath("youtube_video/"), filename_prefix=f"{prefix} ")
        )
        apath = (
            yt.streams.filter(adaptive=True, file_extension="mp4", only_audio=True)
            .order_by("abr")
            .desc()
            .first()
            .download(output_path=self.fpath("youtube_audio/"), filename_prefix=f"{prefix} ")
        )

        v = VideoFileClip(vpath)
        a = AudioFileClip(apath)

        v.audio = a
        print(v.fps)
        v.write_videofile(self.fpath(f"youtube/{vpath.split('/')[-1]}"), fps=v.fps)

    #     v.download(DOWNLOAD_FOLDER)

    def playlistdown(self, url: str, prefix: str = ""):
        pl = Playlist(url)

        for v in pl.video_urls:
            try:
                self.ydown(v, prefix)
            except Exception as e:
                print(e)
                continue


# binary dataset preparation
def move_dir(source_dir, temp_normal_dir, temp_flood_dir):
    '''
        크롤링으로 모은 이미지들을 이진분류에 쓰기위해 분류!
        jupyter notebook에서 작업 필요

        [Usage]
        folder_list = glob.glob('../data/crawling_img/*')
        temp_normal_dir = '../data/binary/temp_normal'
        temp_flood_dir = '../data/binary/temp_flood'
        move_dir(folder_list[0], temp_normal_dir, temp_flood_dir)
    '''
    source = source_dir.split('/')[-1]
    img_list = glob(source_dir + '/*.jpg')
    n = len(img_list)
    for i, img_path in enumerate(img_list):
        print('{}/{}'.format(i, n))
        img_name = img_path.split('/')[-1]
        img = plt.imread(img_path)
        # plt.imshow(img)
        # plt.axis('off')
        # plt.show()

        decision = input('정상 : 0, flood : 1, 삭제 : d, 사용안함 : n, quit: q \n')

        if decision == '0':
            shutil.move(img_path, os.path.join(temp_normal_dir, source + '_' + img_name))
        elif decision == '1':
            shutil.move(img_path, os.path.join(temp_flood_dir, source + '_' + img_name))
        elif decision == 'd':
            os.remove(img_path)
        elif decision == 'q':
            break
        else:
            pass
        # clear_output()



def check_data_amount(normal_dir='../data/binary/normal', flood_dir='../data/binary/flood'):
    normal = glob.glob(normal_dir + '/*.jpg')
    print('normal :', len(normal))
    flood = glob.glob(flood_dir + '/*.jpg')
    print('flood :', len(flood))


# url data
class CctvUrlData:
    # df_path = '../data/tabular/서비스지역_CCTV_정보.csv'
    def __init__(self, api_key, df_path):
        self.api_key = api_key
        self.service_df = pd.read_csv(df_path, encoding='cp949')
        self.m3u8_url = {}

    def cctv_link_crawling(self):
        url = 'https://www.utic.go.kr/guide/cctvOpenData.do?key={}'.format(self.api_key)
        xpath = '//*[@id="vid_html5_api"]/source'
        xpath2 = '//*[@id="innerObject"]/div/script'

        chromedriver_path = '../chromedriver/chromedriver'
        socket.setdefaulttimeout(30)
        driver = webdriver.Chrome(chromedriver_path)
        driver.get(url)
        driver.maximize_window()

        click_elements = []
        trs = driver.find_elements(By.TAG_NAME, 'tr')

        for tr in trs:
            # 첫번째 anchor요소만 a_tags에 저장
            cctv, management = tr.find_elements(By.TAG_NAME, 'a')
            #     print(cctv.get_attribute('innerText'))
            management = management.get_attribute('innerText')

            if management == '국가교통정보센터(고속도로)' or management == '서울교통정보센터':
                # if management in ['경주교통정보센터', '거제교통정보센터', '구미교통정보센터', '남양주교통정보센터'] :
                cctv_name = cctv.get_attribute('innerText').split(".")[-1]
                #         if cctv_name in list(service_df['CCTVNAME']) :
                #             print(cctv_name)
                click_elements.append([cctv_name, cctv])

        print('anchor tag 저장 완료')

        for cctv_name, element in click_elements:
            element.click()
            time.sleep(3)
            driver.switch_to.window(driver.window_handles[1])
            try:
                # 서울시
                src = driver.find_element('xpath', xpath).get_attribute('src')
                self.m3u8_url[cctv_name] = src
            except Exception as e:
                try:
                    # 국가교통정보센터
                    src = driver.find_element('xpath', xpath2).get_attribute('innerText')
                    src = src.split("'")[3]
                    self.m3u8_url[cctv_name] = src
                except:
                    print('{} fail'.format(cctv_name))
            # popup close
            driver.close()
            driver.switch_to.window(driver.window_handles[0])

        driver.quit()

    def save_to_df(self):
        self.service_df['video'] = None

        for key, item in self.m3u8_url.items():
            self.service_df.loc[self.service_df['CCTVNAME'] == key, 'video'] = item

        self.service_df.to_csv('../data/tabular/서비스지역_CCTV_정보.csv', encoding='cp949', index=False)

    def create_txt(self, postfix='_day'):
        # for loop execute  shell script
        df = self.service_df[self.service_df['CENTERNAME'] == '서울교통정보센터']
        link_name = list(df['video'] + '-' + df['CCTVID'] + postfix + '.mp4\n')

        with open('../data/link_name.txt', 'w') as file:
            file.writelines(link_name)


if __name__ == '__main__':
    pass
