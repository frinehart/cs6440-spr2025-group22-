from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import numpy as np
import os
import requests

# ✅ Serve from React build directory
app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

# ✅ Use direct MongoDB connection string (from MONGO_URI env var)
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["myDatabase"]
collection = db["myCollection"]

# ✅ Google Drive file IDs for models (v2)
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

# ✅ Download models if needed
for fname, fid in gdrive_files.items():
    download_model_file(fname, fid)

# ✅ Load models
models = {
    "inf_a": joblib.load("flu_model_inf_a_v2.pkl"),
    "inf_b": joblib.load("flu_model_inf_b_v2.pkl"),
    "inf_all": joblib.load("flu_model_inf_all_v2.pkl"),
    "rsv": joblib.load("flu_model_rsv_v2.pkl"),
    "otherrespvirus": joblib.load("flu_model_otherrespvirus_v2.pkl")
}

# Region encoding
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

# ✅ Serve the React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)







