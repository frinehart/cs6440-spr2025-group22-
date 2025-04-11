FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

COPY react-ui/cs6440-group-22/build /app/build

ENV FLASK_APP=app.py

CMD ["python", "app.py"]







