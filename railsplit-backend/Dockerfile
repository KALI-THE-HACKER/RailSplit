FROM mcr.microsoft.com/playwright/python:v1.52.0-jammy

# Prevent Python from writing pyc files and enable stdout/stderr unbuffered
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies first (layer cache optimization)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ensure Playwright Chromium browser is installed
RUN playwright install chromium

# Copy application source code
COPY ./app .

EXPOSE 3108

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "2", "-b", "0.0.0.0:3108", "FastAPI:app"]