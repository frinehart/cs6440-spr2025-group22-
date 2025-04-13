from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import random
import os

# ✅ Setup Flask app to serve React from 'build'
app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

# ✅ Constants
flu_types = ["inf_a", "inf_b", "inf_all", "rsv", "otherrespvirus"]
regions = ["AFR", "AMR", "EMR", "EUR", "SEAR", "WPR"]

# ✅ Mock data generator
@app.route("/data", methods=["GET"])
def get_mock_data():
    year = 2024
    week = 12
    mock_data = []

    for region in regions:
        entry = {
            "iso_year": year,
            "iso_week": week,
            "whoregion": region
        }
        for flu in flu_types:
            entry[flu] = random.randint(100000, 3500000)
        mock_data.append(entry)

    return jsonify(mock_data)

# ✅ Serve React frontend (index.html and static files)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# ✅ Main entry
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)












