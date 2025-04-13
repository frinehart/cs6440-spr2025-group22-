# Use official Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    libatlas-base-dev \
    nodejs \
    npm \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install gdown for downloading models
RUN pip install --no-cache-dir gdown

# ------------------------------
# STEP 1: Build React frontend
# ------------------------------
COPY react-ui/ ./react-ui
WORKDIR /app/react-ui
RUN npm install && npm run build

# ------------------------------
# STEP 2: Set up backend
# ------------------------------
WORKDIR /app
COPY backend/ ./backend/
COPY backend/requirements.txt ./requirements.txt

# ✅ Download models directly into backend folder
RUN gdown https://drive.google.com/uc?id=1zTQjJV1Tdo_nCtpCM7rP8e6wIjEG_A7j -O backend/flu_model_inf_a_v2.pkl && \
    gdown https://drive.google.com/uc?id=15ZxnYML2SWJja5xTTouRo2GiN49Hr7XI -O backend/flu_model_inf_all_v2.pkl && \
    gdown https://drive.google.com/uc?id=1gtBlaikJU9NXCMO71srohiWnnVJx-xq3 -O backend/flu_model_inf_b_v2.pkl && \
    gdown https://drive.google.com/uc?id=1jryMeOAlaq8xQqkRhF-H2Us3Ck8MQWmh -O backend/flu_model_otherrespvirus_v2.pkl && \
    gdown https://drive.google.com/uc?id=14rHJg2GZCHPzjsCeBdXKw1nNF3KMmclG -O backend/flu_model_rsv_v2.pkl

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ------------------------------
# STEP 3: Run Flask app
# ------------------------------
WORKDIR /app/backend
EXPOSE 5000

CMD ["python", "app.py"]



