FROM python:3.11-slim

WORKIR /app

COPY ./app /app

RUN pip install -r requirements.txt

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "4", "-b", "0.0.0.0:3108"]