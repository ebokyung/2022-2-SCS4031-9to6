
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

# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run test -- --browsers ChromeHeadlessNoSandbox --watch=false

ARG configuration=production

RUN npm run build -- --output-path=./dist/out --configuration $configuration


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
