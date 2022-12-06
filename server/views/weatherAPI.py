# 기상청 초단기실황 api

from urllib.parse import urlencode, unquote
import requests
import json
from datetime import datetime, date, timedelta
import math
from model.cctv import CCTV

# base_time와 base_date 구하는 함수
def getBase():
    now = datetime.now()
    today = datetime.today().strftime("%Y%m%d")
    y = date.today() - timedelta(days=1)
    yesterday = y.strftime("%Y%m%d")
        
    if now.minute < 40: 
        if now.hour == 0:
            base_time = "2300"
            base_date = yesterday
        else:
            pre_hour = now.hour-1
            if pre_hour<10:
                base_time = "0" + str(pre_hour) + "00"
            else:
                base_time = str(pre_hour) + "00"
            base_date = today
    else:
        base_time = now.strftime("%H00")
        base_date = today
    
    return base_date, base_time


Re = 6371.00877     ##  지도반경
grid = 5.0          ##  격자간격 (km)
slat1 = 30.0        ##  표준위도 1
slat2 = 60.0        ##  표준위도 2
olon = 126.0        ##  기준점 경도
olat = 38.0         ##  기준점 위도
xo = 210 / grid     ##  기준점 X좌표
yo = 675 / grid     ##  기준점 Y좌표
first = 0

if first == 0 :
    PI = math.asin(1.0) * 2.0
    DEGRAD = PI/ 180.0
    RADDEG = 180.0 / PI


    re = Re / grid
    slat1 = slat1 * DEGRAD
    slat2 = slat2 * DEGRAD
    olon = olon * DEGRAD
    olat = olat * DEGRAD

    sn = math.tan(PI * 0.25 + slat2 * 0.5) / math.tan(PI * 0.25 + slat1 * 0.5)
    sn = math.log(math.cos(slat1) / math.cos(slat2)) / math.log(sn)
    sf = math.tan(PI * 0.25 + slat1 * 0.5)
    sf = math.pow(sf, sn) * math.cos(slat1) / sn
    ro = math.tan(PI * 0.25 + olat * 0.5)
    ro = re * sf / math.pow(ro, sn)
    first = 1

# 위도, 경도를 x, y 좌표로 변경하는 함수
def mapToGrid(lat, lon, code = 0 ):
    ra = math.tan(PI * 0.25 + lat * DEGRAD * 0.5)
    ra = re * sf / pow(ra, sn)
    theta = lon * DEGRAD - olon
    if theta > PI :
        theta -= 2.0 * PI
    if theta < -PI :
        theta += 2.0 * PI
    theta *= sn
    x = (ra * math.sin(theta)) + xo
    y = (ro - ra * math.cos(theta)) + yo
    x = int(x + 1.5)
    y = int(y + 1.5)
    return x, y

# 초단기실황 api를 호출해 온도, 습도, 1시간 강수량을 리턴하는 함수
def getWeather(cctvID):
    base_date, base_time = getBase()
    res = requests.get("http://3.38.178.241:5000/cctvs/{}".format(cctvID)).json()
    cctv = res["cctv"]
    # cctv = CCTV.query.get(cctvID)
    lat = cctv["Latitude"]
    lon = cctv["Longitude"]
    nx, ny = mapToGrid(lat, lon)

    ls_url = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"
    ls_url2 = "?" + urlencode(

            {

                    "ServiceKey" : unquote("Ig305vjzG01urQJR7VkY6XXiBDTkRkJ5b8Jar3cyq5Q6tl4neoFjq5u%2FhitQ0CB1CB%2BfD3PmaJa2Xo6ZWVaqXw%3D%3D"),

                    "base_date" : base_date,

                    "base_time" : base_time,

                    "nx" : nx,

                    "ny" : ny,

                    "numOfRows" : "10",

                    "pageNo" : 1,

                    "dataType" : "JSON",

            }

    )


    ls_queryurl = ls_url + ls_url2
    # 위에 있는 ls_queryurl 대신에 아래의 한줄을 사용하여도 됨
    # ls_queryurl= "http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtNcst?ServiceKey=인증키&base_date=20210709&base_time=1500&nx=55&ny=125&numOfRows=10&pageNo=1&dataType=JSON"

    response = requests.get(ls_queryurl, verify=False) #해당url주소의 데이터를 가져와서 response에 담는다
    ls_dict = json.loads(response.text) #json문자열을 파이썬 객체로 변환한다.

    ls_response = ls_dict.get("response")
    ls_body = ls_response.get("body")
    ls_items = ls_body.get("items")
    ls_item = ls_items.get("item")

    result={} # result라는 딕셔너리 변수를 선언함, 딕셔너리는 초기화를 해야 사용할수 있다
    result_dict={}  # result_dict라는 키와 값을 담아둘 딕셔너리를 선언하고 초기화를 시킨다.

    #루프문에서 result_dict 에는 키와 값을 담아둔다 예)result_dict['PTY']='0'  , result_status['REH']='97'
    for item in ls_item:  #ls_item에 들어있는 배열의 개수만큼 반복함
        result=item
        # print(result)
        result_dict.setdefault(result.get("category"),result.get("obsrValue"))

    return result_dict["T1H"], result_dict["REH"], result_dict["RN1"]
    # print("날짜 : "+result.get("baseDate")[:-4]+"년"+result.get("baseDate")[4:-2]+"월"+result.get("baseDate")[6:]+"일"+"시간 : " + result.get("baseTime")[:-2]+"시")
    # print("강우형태 : "+result_dict["PTY"])
    # print("습도 : "+result_dict["REH"]+" %")
    # print("1시간 강수량 : " +result_dict["RN1"]+" mm")
    # print("기온 : "+result_dict["T1H"] +" ℃")
    # print("동서바람성분 : " +result_dict["UUU"]+" m/s")
    # print("남북바람성분 : " + result_dict["VVV"]+" m/s")
    # print("풍향 : "+result_dict["VEC"])
    # print("풍속 : "+result_dict["WSD"])