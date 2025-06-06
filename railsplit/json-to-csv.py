import csv
import json

csv_file = 'stations.csv'      # your input CSV file
json_file = 'stations.json'    # output JSON file

data = []

with open(csv_file, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append(row)

with open(json_file, mode='w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
