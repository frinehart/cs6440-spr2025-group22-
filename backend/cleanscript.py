import pandas as pd

df = pd.read_csv("../data/VIW_FNT_final.csv")
print("Column names:")
print(df.columns.tolist())
