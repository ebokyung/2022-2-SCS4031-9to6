FROM tiangolo/uwsgi-nginx-flask:python3.8
RUN pip install flask_cors
COPY ./app /app