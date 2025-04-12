# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# ✅ Copy frontend build
COPY react-ui/cs6440-group-22/build/ ./react-ui/cs6440-group-22/build/

# Expose the app port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]










