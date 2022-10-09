
# FROM node:16-alpine as build-step
# WORKDIR my-react-app
# ENV PATH /my-react-app/node_modules/.bin:$PATH
# COPY package.json yarn.lock ./
# COPY ./src ./src
# COPY ./public ./public
# RUN yarn install
# RUN yarn build

FROM tiangolo/uwsgi-nginx-flask:python3.8
RUN pip install flask_cors
COPY ./app /app

FROM node:12.22.9 as builder

# 작업 폴더를 만들고 npm 설치
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY app/my-react-app/package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@2.1.3 -g --silent

# 소스를 작업폴더로 복사하고 앱 실행
COPY . /usr/src/app
CMD ["npm", "start"]
