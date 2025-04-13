# Use official Python base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies needed for pandas, numpy, and building React
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    libatlas-base-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------
# STEP 1: Build React frontend
# ------------------------------
COPY react-ui/ ./react-ui
WORKDIR /app/react-ui

RUN npm install && npm run build

# ------------------------------
# STEP 2: Set up backend (Flask)
# ------------------------------
WORKDIR /app
COPY backend/ ./                 # includes app.py, models, data/
COPY backend/requirements.txt ./  # needed for pip install

RUN pip install --no-cache-dir -r requirements.txt

# ------------------------------
# STEP 3: Final setup
# ------------------------------
EXPOSE 5000
CMD ["python", "app.py"]


