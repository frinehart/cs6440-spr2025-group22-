# ---------------------
# STEP 1: Build React frontend
# ---------------------
    FROM node:18 AS frontend

    WORKDIR /app/react-ui
    COPY react-ui/package.json react-ui/package-lock.json ./
    RUN npm install
    
    COPY react-ui/ ./
    RUN npm run build
    
    # ---------------------
    # STEP 2: Set up Flask backend
    # ---------------------
    FROM python:3.11-slim AS backend
    
    WORKDIR /app
    
    # Install Python dependencies
    COPY backend/requirements.txt ./requirements.txt
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Copy Flask app
    COPY backend/app.py ./app.py
    
    # Copy built React frontend from previous stage
    COPY --from=frontend /app/react-ui/build ./build
    
    # Expose Flask port
    EXPOSE 5000
    
    # Start Flask server
    CMD ["python", "app.py"]



