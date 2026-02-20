import os
import json

stops_all = {}
station_to_routes = {} # {stop_id: [route_ids]}
routes_path = 'data/routes'
all_stops_file = 'data/all_stops.js'

for filename in os.listdir(routes_path):
    if filename.endswith('.js'):
        route_id = filename.replace('.js', '')
        try:
            with open(os.path.join(routes_path, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                start_str = '"stops":'
                start_idx = content.rfind(start_str)
                if start_idx != -1:
                    end_idx = content.rfind('});')
                    if end_idx != -1:
                        json_str = content[start_idx + len(start_str) : end_idx]
                        json_str = json_str.strip()
                        stops = json.loads(json_str)
                        
                        stops_all.update(stops)
                        
                        for stop_id in stops.keys():
                            if stop_id not in station_to_routes:
                                station_to_routes[stop_id] = []
                            if route_id not in station_to_routes[stop_id]:
                                station_to_routes[stop_id].append(route_id)
        except Exception as e:
            print(f"Error parsing {filename}: {e}")

# Identify popular stations
popular_names = [
    "New York Penn Station",
    "Newark Penn Station",
    "Secaucus Junction",
    "Trenton Transit Center",
    "Hoboken Terminal",
    "Newark Broad St",
    "Atlantic City",
    "Metropark",
    "Princeton Junction",
    "Hamilton",
    "Rahway"
]

# Add a 'popular' flag and route info
popular_names_upper = [name.upper() for name in popular_names]

for stop_id, stop_info in stops_all.items():
    stop_info['id'] = stop_id # Ensure ID is in info
    if stop_info.get('name', '').upper() in popular_names_upper:
        stop_info['popular'] = True
    else:
        stop_info['popular'] = False
    
    stop_info['routes'] = station_to_routes.get(stop_id, [])

# Sort stops by popular DESC, name ASC or just name (we will handle "popular first" in JS)
sorted_stops = dict(sorted(stops_all.items(), key=lambda item: item[1].get('name', '')))

with open(all_stops_file, 'w', encoding='utf-8') as f:
    f.write('window.loadAllStops(' + json.dumps(sorted_stops) + ');')

print(f"Successfully consolidated {len(sorted_stops)} stops with route mappings.")
