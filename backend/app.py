from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np
import os
import requests

# ✅ Serve from React build directory
app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

# ✅ Load CSV file into memory
CSV_PATH = "data/VIW_FNT_final.csv"
df = pd.read_csv(CSV_PATH)

# ✅ Google Drive file IDs for models
gdrive_files = {
    "flu_model_inf_a_v2.pkl": "1zTQjJV1Tdo_nCtpCM7rP8e6wIjEG_A7j",
    "flu_model_inf_all_v2.pkl": "15ZxnYML2SWJja5xTTouRo2GiN49Hr7XI",
    "flu_model_inf_b_v2.pkl": "1gtBlaikJU9NXCMO71srohiWnnVJx-xq3",
    "flu_model_otherrespvirus_v2.pkl": "1jryMeOAlaq8xQqkRhF-H2Us3Ck8MQWmh",
    "flu_model_rsv_v2.pkl": "14rHJg2GZCHPzjsCeBdXKw1nNF3KMmclG"
}

def download_model_file(filename, file_id):
    """Download file from Google Drive if not cached."""
    if not os.path.exists(filename):
        print(f"📥 Downloading {filename}...")
        url = f"https://drive.google.com/uc?export=download&id={file_id}"
        response = requests.get(url, allow_redirects=True)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"✅ Downloaded {filename}")
        else:
            raise Exception(f"❌ Failed to download {filename} (status: {response.status_code})")

# ✅ Download and load models
models = {}
for fname, fid in gdrive_files.items():
    download_model_file(fname, fid)
    model_key = fname.replace("flu_model_", "").replace("_v2.pkl", "")
    models[model_key] = joblib.load(fname)

# ✅ Region encoding
region_mapping = {
    "AFR": 0,
    "AMR": 1,
    "EMR": 2,
    "EUR": 3,
    "SEAR": 4,
    "WPR": 5
}

@app.route("/predict", methods=["GET"])
def predict_flu_cases():
    try:
        region = request.args.get('region', 'AMR')
        year = int(request.args.get('year', 2024))
        week = int(request.args.get('week', 12))

        # ✅ Support both "target" and "flu_type" parameters
        target = request.args.get('target') or request.args.get('flu_type') or 'inf_a'

        if region not in region_mapping:
            return jsonify({'error': 'Invalid region'}), 400
        if target not in models:
            return jsonify({'error': f'Invalid prediction target: {target}'}), 400

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

# ✅ Optional data API route (if you want to serve raw data)
@app.route("/data", methods=["GET"])
def get_data():
    return df.to_json(orient="records")

# ✅ Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")









