# Use a Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (includes Node.js and npm)
RUN apt-get update && \
    apt-get install -y curl gnupg nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Copy backend dependencies and install them
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy React frontend source code and build it
COPY react-ui/cs6440-group-22 ./react-ui
WORKDIR /app/react-ui
RUN npm install && npm run build

# Move React build into Flask static folder
RUN cp -r build ../build

# Return to backend app directory
WORKDIR /app

# Expose Flask port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]

















