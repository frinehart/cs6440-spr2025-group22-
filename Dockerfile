# ----------- Stage 1: Build React frontend -----------
FROM node:18 AS build

WORKDIR /app

# Copy React files and install dependencies
COPY react-ui/package.json react-ui/package-lock.json ./react-ui/
RUN cd react-ui && npm install

# Copy rest of frontend code and build
COPY react-ui ./react-ui
RUN cd react-ui && npm run build


# ----------- Stage 2: Serve Flask + frontend -----------
FROM python:3.11-slim

WORKDIR /app

# Install Flask dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask app
COPY app.py .

# Copy built frontend from previous stage
COPY --from=build /app/react-ui/build ./build

# Set environment variable for Flask
ENV FLASK_ENV=production

# Expose port
EXPOSE 5000

# Start Flask app
CMD ["python", "app.py"]





