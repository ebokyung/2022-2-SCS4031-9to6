# 2022-2-SCS4031-9to6
2022-2 융합캡스톤디자인 9to6

## 🌧️ 개요


Yolov5와 Inception ResNet 활용해 침수 단계 판별 모델을 구현하였고 해당 모델을 적용하여 실시간으로 도로의 침수 상황을 확인할 수 있도록 구현했습니다. 이 외에도 제보, 채팅 기능 등을 추가하여 웹서비스를 제작했습니다.

## 💭 추진 배경



현재는 폭우가 쏟아지는 날 침수 상황이 발생한다면 뒤늦게 뉴스로 확인하는 방법밖에 없습니다. 따라서 침수 지역에 대한 정보가 부족한 채로 이동하게 되어 사회적으로 많은 인명, 재산 피해가 발생하고 있습니다.

위와 같은 현상을 개선하기 위해 웹을 통하여 상습 침수 지역의 침수 상태를 표시하고 위험 정보를 제공하는 서비스를 개발하였습니다. 

## ⛳ 목표


인공지능을 활용하여 **상습 침수지역 모니터링** 모델을 구축하고 실시간 모니터링 결과 및 **침수 관련 위험 정보**를 제공하는 서비스 개발

![image](https://user-images.githubusercontent.com/78717113/224681772-f4c39984-746d-43fd-bd6d-fcfd4e4576c3.png)

## 📝 계획



### 시스템 블록 다이어그램

- 웹 서비스의 기능 및 기능 구현을 위한 api를 구체화했습니다.

![image](https://user-images.githubusercontent.com/78717113/224683766-b26339ab-fb5c-40e8-be62-d46cfd67493c.png)

### 딥러닝 모델 플로우 차트

- 서버 자원 소모를 줄이기 위해 **비가 오는 경우에만** 침수 단계 판별 모델을 실행합니다.
- 자동차 객체가 탐지된 경우 **물에 잠긴 정도에 따라 침수 단계를 판별**하여 리턴합니다.

![image](https://user-images.githubusercontent.com/78717113/224683911-ce0f197c-885e-4d45-b830-69f342ca6079.png)

- 객체가 여러 개 탐지된 경우 가장 많이 탐지된 단계를 리턴합니다.
- 자동차 **객체가 탐지되지 않은 경우 이미지 분류 모델을 실행**하여 단순 침수 유무만 판별하여 리턴합니다.

![image](https://user-images.githubusercontent.com/78717113/224683986-9306d93f-42ba-4fec-a081-3dbbf4c66494.png)

### 딥러닝 모델 시퀀스 다이어그램

- 침수 단계 inference 요청이 들어오면 데이터베이스에 저장된 cctv url을 불러옵니다.
- ffmpeg 라이브러리를 활용해 **cctv url의 m3u8 파일을 다운로드**합니다.
- 다운로드가 정상적으로 완료되면 딥러닝 모델을 실행하여 침수 단계를 판별하여 리턴합니다.
- 파일 다운로드 시간을 고려하여 백그라운드 작업을 요구하는 **비동기 작업 큐**를 도입하였습니다.

![image](https://user-images.githubusercontent.com/78717113/224684058-e3b8613b-d9df-46dd-85a0-e048be644d63.png)

</aside>

## ✅ 기능



### 침수 모니터링

- 딥러닝 모델을 이용해 실시간 cctv 영상의 침수 단계를 판단합니다.
- 판단 결과를 **단계별 색으로 지도에 나타내** 사용자에게 제공합니다.

![image](https://user-images.githubusercontent.com/78717113/224684130-8dc7f8db-fafd-474b-b0c8-ddf1f644d035.png)
![image](https://user-images.githubusercontent.com/78717113/224684821-d0f8b31a-a804-4f30-b053-389390c7a77c.png)


### 실시간 알림 및 채팅

- 1단계 이상 침수 상황 발생 시 서로의 상황에 대해 실시간으로 대화를 나눌 수 있는 채팅방을 오픈합니다.

![image](https://user-images.githubusercontent.com/78717113/224684187-4e6194f1-66e3-48b0-8b29-a3741b637a87.png)

### CCTV 즐겨찾기

- 자주 가는 지역의 cctv를 즐겨찾기에 등록할 수 있게 하여 사용자의 편의성을 높였습니다.

![image](https://user-images.githubusercontent.com/78717113/224684248-4cd22c62-fb8e-45c8-8099-3bc40117bc4d.png)

### 침수 상황 제보

- cctv가 설치되지 않은 지역에 침수가 발생했을 때 사용자가 위치와 상황을 제보할 수 있도록 하였습니다.
- **공공 제공 cctv의 밀도가 높지 않다는 한계점을 보완**할 수 있습니다.

![image](https://user-images.githubusercontent.com/78717113/224684297-2d717221-8fc1-49f2-ad91-00e52e7ca2b4.png)

### 침수 관련 데이터 제공

- 침수 단계, 날씨 정보, 제보 개수 등 침수 발생 상황에 대한 정보를 누적하고 쉽게 알아볼 수 있게 가공하여 제공합니다.
- 추후 **침수 관련 인프라 개선 시 기초 자료로 활용**될 수 있습니다.

![image](https://user-images.githubusercontent.com/78717113/224684430-b37e5181-12ba-4439-a8e3-d325a1aa231d.png)

### 근처 대피소 위치 및 행동 지침 안내

- 지도 상에 대피소를 표시하고 시설 정보를 제공합니다.
- 침수 발생 시의 행동 지침 안내 페이지로 이동할 수 있습니다.

![image](https://user-images.githubusercontent.com/78717113/224685204-52a2ab18-8936-4662-aa6c-b6a651500a5e.png)
## 🛠️ 사용 기술
### OS
Linux
### 딥러닝
Tensorflow2.10, Pytorch>=1.7, Opencv, Wandb
### 데이터
Geopandas, QGIS, Selenium
### 프론트엔드
React, Recoil, Styled-Component
### 백엔드
Flask, Node.js
### 데이터베이스
MySQL, Redis
### DevOps
Docker
### 클라우드
AWS EC2, RDS, S3
### 협업툴
Notion, Github
