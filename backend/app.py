from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import numpy as np
import os
import requests

app = Flask(__name__, static_folder="build")
CORS(app)

# Connect to MongoDB
client = MongoClient("mongodb://my-mongo:27017/")
db = client["myDatabase"]
collection = db["myCollection"]

# Google Drive file IDs for model files
gdrive_files = {
    "flu_model_inf_a.pkl": "1Fg0yuWG72OjEYI8XFeF1-gfNelyUphS1",
    "flu_model_inf_all.pkl": "1fgYrwbFPDNOm3wxwkDeFvna70-Ywhheu",
    "flu_model_inf_b.pkl": "1xVj_mGcyvjo4tRCP1zCf5Vy94_cXWpZ5",
    "flu_model_otherrespvirus.pkl": "1oDvVydfST_LzRblF2gREWRYKalgwRjFV",
    "flu_model_rsv.pkl": "1yhrPWsCQlEWgbCqKQQboMuaYpRQhndJC"
}

def download_model_file(filename, file_id):
    """Download large Google Drive files with confirmation token handling."""
    if os.path.exists(filename):
        return

    print(f"Downloading {filename} from Google Drive...")
    URL = "https://docs.google.com/uc?export=download"

    session = requests.Session()
    response = session.get(URL, params={"id": file_id}, stream=True)
    token = get_confirm_token(response)

    if token:
        params = {"id": file_id, "confirm": token}
        response = session.get(URL, params=params, stream=True)

    save_response_content(response, filename)
    print(f"Downloaded {filename} ✅")

def get_confirm_token(response):
    for key, value in response.cookies.items():
        if key.startswith("download_warning"):
            return value
    return None

def save_response_content(response, destination):
    CHUNK_SIZE = 32768
    with open(destination, "wb") as f:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:
                f.write(chunk)

# Ensure all model files are downloaded
for file_name, file_id in gdrive_files.items():
    download_model_file(file_name, file_id)

# Load ML models for predictions
models = {
    "inf_a": joblib.load("backend/flu_model_inf_a_v2.pkl"),
    "inf_b": joblib.load("backend/flu_model_inf_b_v2.pkl"),
    "inf_all": joblib.load("backend/flu_model_inf_all_v2.pkl"),
    "rsv": joblib.load("backend/flu_model_rsv_v2.pkl"),
    "otherrespvirus": joblib.load("backend/flu_model_otherrespvirus_v2.pkl")
}

region_mapping = {
    'AFR': 0, 'AMR': 1, 'EMR': 2, 'EUR': 3, 'SEAR': 4, 'WPR': 5, 'Other': 6
}

@app.route("/data", methods=["GET"])
def get_data():
    data = list(collection.find({}, {"_id": 0}))
    return jsonify(data)

@app.route("/predict", methods=["GET"])
def predict_flu_cases():
    try:
        region = request.args.get('region', 'AMR')
        year = int(request.args.get('year', 2024))
        week = int(request.args.get('week', 12))
        target = request.args.get('target', 'inf_a')

        if region not in region_mapping:
            return jsonify({'error': 'Invalid region'}), 400
        if target not in models:
            return jsonify({'error': 'Invalid prediction target'}), 400

        region_code = region_mapping[region]
        features = np.array([[year, week, region_code]])
        prediction = models[target].predict(features)[0]

        return jsonify({
            'region': region,
            'year': year,
            'week': week,
            'target': target,
            'predicted_cases': int(prediction)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    build_dir = os.path.join(os.path.dirname(__file__), '..', 'react-ui', 'cs6440-group-22', 'build')
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
