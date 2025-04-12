# Use slim Python base
FROM python:3.11-slim

# Create app directory
WORKDIR /app

# Copy backend requirements first for caching
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy React frontend source code and build it
COPY react-ui/cs6440-group-22 ./react-ui
WORKDIR /app/react-ui
RUN npm install && npm run build

# Move back to backend to serve React build
WORKDIR /app
RUN cp -r react-ui/build ./build

# Expose Flask port
EXPOSE 5000

# Start Flask
CMD ["python", "app.py"]


















