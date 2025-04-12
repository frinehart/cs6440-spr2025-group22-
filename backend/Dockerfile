# Use slim Python base
FROM python:3.11-slim

# Create app directory
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy and build React app
COPY react-ui/ ./react-ui
WORKDIR /app/react-ui/cs6440-group-22
RUN npm install && npm run build

# Move build into Flask static folder
WORKDIR /app
RUN cp -r react-ui/cs6440-group-22/build ./build

# Expose port and run Flask
EXPOSE 5000
CMD ["python", "app.py"]