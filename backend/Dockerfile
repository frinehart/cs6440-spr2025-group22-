FROM python:3.11

WORKDIR /app

# Copy backend app code
COPY backend/ .  

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend build into /app/build
COPY react-ui/cs6440-group-22/build ./build

CMD ["python", "app.py"]







