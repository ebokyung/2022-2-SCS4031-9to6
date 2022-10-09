FROM tiangolo/uwsgi-nginx-flask:python3.8
RUN pip install flask_cors
COPY ./app /app

FROM node:12.22.9 as builder
COPY package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@2.1.3 -g --silent