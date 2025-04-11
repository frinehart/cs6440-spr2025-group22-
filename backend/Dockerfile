FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy frontend production build
COPY react-ui/cs6440-group-22/build /app/build

# Set environment variable for Flask
ENV FLASK_APP=app.py

# Start the Flask app
CMD ["python", "app.py"]







