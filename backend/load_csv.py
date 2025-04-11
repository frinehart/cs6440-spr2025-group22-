import pandas as pd
from pymongo import MongoClient

# Read CSV from the 'data' folder
df = pd.read_csv("data/VIW_FNT_final.csv")

# Convert DataFrame rows to dictionaries
data = df.to_dict(orient="records")

# Connect to MongoDB inside Docker
client = MongoClient("mongodb://my-mongo:27017/")
db = client["myDatabase"]
collection = db["myCollection"]

# Optional: Clear old data
collection.delete_many({})

# Insert new data
collection.insert_many(data)

print("✅ CSV data successfully loaded into MongoDB.")

