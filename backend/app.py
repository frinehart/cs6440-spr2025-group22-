from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np
import os

# ✅ Serve from React build directory
app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

# ✅ Load CSV file into memory
CSV_PATH = "data/VIW_FNT_final.csv"
df = pd.read_csv(CSV_PATH)

# ✅ Load models from pre-downloaded files (handled in Docker build)
models = {}
model_files = {
    "inf_a": "flu_model_inf_a_v2.pkl",
    "inf_all": "flu_model_inf_all_v2.pkl",
    "inf_b": "flu_model_inf_b_v2.pkl",
    "otherrespvirus": "flu_model_otherrespvirus_v2.pkl",
    "rsv": "flu_model_rsv_v2.pkl"
}

for key, path in model_files.items():
    models[key] = joblib.load(path)

print("✅ All models loaded.")

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

# ✅ Optional data API route
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

# ✅ Bind Flask to 0.0.0.0 for Render deployment
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)











