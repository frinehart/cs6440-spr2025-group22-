import joblib

files = [
    "flu_model_inf_a.pkl",
    "flu_model_inf_all.pkl",
    "flu_model_inf_b.pkl",
    "flu_model_otherrespvirus.pkl",
    "flu_model_rsv.pkl"
]

for file in files:
    try:
        print(f"🔄 Loading {file}...")
        model = joblib.load(file)
        new_file = file.replace(".pkl", "_v2.pkl")
        joblib.dump(model, new_file, protocol=4)
        print(f"✅ Saved: {new_file}")
    except Exception as e:
        print(f"❌ Error processing {file}: {e}")




