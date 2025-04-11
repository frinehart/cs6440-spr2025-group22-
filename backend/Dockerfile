<<<<<<< HEAD
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

COPY react-ui/cs6440-group-22/build /app/build

ENV FLASK_APP=app.py
=======
FROM python:3.11

WORKDIR /app

# Copy backend app code
COPY backend/ .  

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend build into /app/build
COPY react-ui/cs6440-group-22/build ./build
>>>>>>> 8934f0ea17ff472dc4f3935e22acf817b327d842

CMD ["python", "app.py"]







