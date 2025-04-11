import joblib

files = [
    "flu_model_inf_a.pkl",
    "flu_model_inf_all.pkl",
    "flu_model_inf_b.pkl",
    "flu_model_otherrespvirus.pkl",
    "flu_model_rsv.pkl"
]

for file in files:
    print(f"🔄 Loading {file}")
    model = joblib.load(file)
    new_name = file.replace(".pkl", "_v2.pkl")
    joblib.dump(model, new_name, protocol=4)
    print(f"✅ Saved {new_name}")


