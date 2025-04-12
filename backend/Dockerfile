# Use a Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl gnupg && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# ✅ Copy prebuilt React frontend into /app/build for Flask to serve
COPY react-ui/cs6440-group-22/build ./build

# Expose Flask port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]














