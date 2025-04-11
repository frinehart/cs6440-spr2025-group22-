FROM python:3.11-slim

WORKDIR /app

# Install exact versions
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY backend/ .

# Set environment variables
ENV FLASK_APP=app.py

CMD ["python", "app.py"]








