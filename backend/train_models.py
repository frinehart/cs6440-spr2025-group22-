import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Load dataset
csv_path = "data/VIW_FNT_final.csv"
df = pd.read_csv(csv_path)

# Preprocess
print("Preprocessing...")
df['iso_weekstartdate'] = pd.to_datetime(df['iso_weekstartdate'])
df['region_encoded'] = df['whoregion'].astype('category').cat.codes

# Features
X = df[['iso_year', 'iso_week', 'region_encoded']]

# Targets to train
targets = ['inf_a', 'inf_b', 'inf_all', 'rsv', 'otherrespvirus']

for target in targets:
    print(f"Training model for {target}...")
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    mse = mean_squared_error(y_test, preds)

    model_filename = f"backend/flu_model_{target}.pkl"
    joblib.dump(model, model_filename)
    print(f"Saved {model_filename} with MSE: {mse:.2f}")

print("All models trained and saved.")
