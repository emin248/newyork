import csv
import os

BASE_DIR = os.getcwd() # Should run from nevyork/nevyork
RAIL_DATA_DIR = os.path.join(BASE_DIR, '..', 'rail_data')

def load_csv(filename):
    data = []
    filepath = os.path.join(RAIL_DATA_DIR, filename)
    print(f"Reading {filepath}...")
    
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return []
    
    # Try reading first few bytes to check for BOM or weird chars
    with open(filepath, 'rb') as f:
        print(f"First 20 bytes: {f.read(20)}")

    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        print(f"Field names: {reader.fieldnames}")
        for row in reader:
            data.append(row)
    return data

stops_data = load_csv('stops.txt')

target_ids = ['38442', '38441']
found_ids = []

print("\nChecking for specific IDs...")
for s in stops_data:
    # Print the keys of the first row to be sure
    if len(found_ids) == 0:
        print(f"First row keys: {list(s.keys())}")
        print(f"First row content: {s}")

    sid = s.get('stop_id')
    if sid in target_ids:
        print(f"Found {sid}: {s.get('stop_name')}")
        found_ids.append(sid)

if len(found_ids) == 0:
    print("NO TAGET IDS FOUND!")
    print(f"Sample IDs in data: {[s.get('stop_id') for s in stops_data[:5]]}")
else:
    print(f"Found {len(found_ids)}/{len(target_ids)} target IDs.")
