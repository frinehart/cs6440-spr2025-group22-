from flask import Flask, jsonify
from flask_cors import CORS
import random
import os

# ✅ Setup Flask app
app = Flask(__name__)
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

# ✅ Optional root path
@app.route("/")
def home():
    return "✅ Mock Flu API is running!"

# ✅ Use PORT from environment (for Render)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)











