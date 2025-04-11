#!/bin/bash

echo "⏳ Importing VIW_FNT_final.csv into MongoDB..."

mongoimport --db myDatabase --collection myCollection 	--type csv --headerline --file /data/VIW_FNT_final.csv 
 

echo "✅ CSV Import complete!"
