# Use official Python base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies for Node + Python
RUN apt-get update && apt-get install -y curl gnupg && rm -rf /var/lib/apt/lists/*

# ------------------------------
# STEP 1: Build React frontend
# ------------------------------
COPY react-ui/ ./react-ui
WORKDIR /app/react-ui

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ------------------------------
# STEP 2: Back to backend
# ------------------------------
WORKDIR /app
COPY backend/ ./
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ------------------------------
# STEP 3: Final Flask setup
# ------------------------------
EXPOSE 5000
CMD ["python", "app.py"]
