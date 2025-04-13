# Stage 1: Build React frontend
FROM node:18 as build

WORKDIR /app
COPY react-ui/package.json react-ui/package-lock.json ./
RUN npm install

COPY react-ui ./react-ui
RUN npm run --prefix react-ui build

# Stage 2: Serve with Flask
FROM python:3.11-slim

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask app
COPY app.py ./

# Copy React build output
COPY --from=build /app/react-ui/build ./build

# Expose port
EXPOSE 5000

# Start Flask
CMD ["python", "app.py"]




