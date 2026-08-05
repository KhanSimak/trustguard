FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY config.py .
COPY inference.py .
COPY schemas.py .

COPY trustguard_onnx ./trustguard_onnx

EXPOSE 8000

CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8000"]

