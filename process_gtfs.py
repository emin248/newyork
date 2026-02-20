import csv
import json
import os
import shutil
from collections import defaultdict

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAIL_DATA_DIR = os.path.join(BASE_DIR, '..', 'rail_data new')
DATA_DIR = os.path.join(BASE_DIR, 'data') # New data directory
ROUTES_DIR = os.path.join(DATA_DIR, 'routes')

def load_csv(filename):
    data = []
    filepath = os.path.join(RAIL_DATA_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Warning: {filename} not found.")
        return []
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    return data

def process_data():
    # Setup directories
    if os.path.exists(DATA_DIR):
        shutil.rmtree(DATA_DIR)
    os.makedirs(ROUTES_DIR)

    print("Loading GTFS data...")
    routes_data = load_csv('routes.txt')
    stops_data = load_csv('stops.txt')
    trips_data = load_csv('trips.txt')
    stop_times_data = load_csv('stop_times.txt')
    calendar_dates_data = load_csv('calendar_dates.txt')

    # Process Stops
    print("Processing Stops...")
    stops = {
        s['stop_id']: {
            'name': s['stop_name'],
            'lat': float(s['stop_lat']) if s['stop_lat'] else None,
            'lon': float(s['stop_lon']) if s['stop_lon'] else None
        } for s in stops_data
    }

    # Process Routes Metadata
    print("Processing Routes...")
    routes_meta = []
    routes_full = {} 

    for r in routes_data:
        route_id = r['route_id']
        route_name = r['route_long_name'] or r['route_short_name']
        active_color = f"#{r['route_color']}" if r['route_color'] else "#2563eb"
        
        routes_meta.append({
            'id': route_id,
            'name': route_name,
            'color': active_color
        })

        routes_full[route_id] = {
            'id': route_id,
            'name': route_name,
            'color': active_color,
            'd0': {'headsign': 'Outbound', 'trips': []}, 
            'd1': {'headsign': 'Inbound', 'trips': []}
        }

    # Process Calendar
    print("Processing Calendar...")
    service_dates = defaultdict(list)
    for cd in calendar_dates_data:
        if cd['exception_type'] == '1':
            service_dates[cd['service_id']].append(cd['date'])
    
    # Process Stop Times
    print("Processing Stop Times...")
    trip_stop_times = defaultdict(list)
    temp_stop_times = defaultdict(list)
    for st in stop_times_data:
        temp_stop_times[st['trip_id']].append(st)
    
    for trip_id, times in temp_stop_times.items():
        times.sort(key=lambda x: int(x['stop_sequence']))
        trip_stop_times[trip_id] = [{
            's': t['stop_id'],
            't': t['departure_time'][:5]
        } for t in times]

    # Process Trips
    print("Processing Trips and Splitting...")
    for trip in trips_data:
        route_id = trip['route_id']
        service_id = trip['service_id']
        trip_id = trip['trip_id']
        direction_id = trip['direction_id']
        headsign = trip['trip_headsign']

        if route_id not in routes_full:
            continue
        
        if trip_id not in trip_stop_times:
            continue

        active_dates = service_dates.get(service_id, [])
        if not active_dates:
            continue 

        stops_list = trip_stop_times[trip_id]
        
        direction_key = f'd{direction_id}'
        routes_full[route_id][direction_key]['headsign'] = headsign
        routes_full[route_id][direction_key]['trips'].append({
            'dates': active_dates,
            'stops': stops_list,
            'h': headsign,
            'n': trip['block_id'] # Train Number
        })

    # Sort routes by name
    routes_meta.sort(key=lambda x: x['name'])

    # Save routes.js (JSONP)
    with open(os.path.join(DATA_DIR, 'routes.js'), 'w', encoding='utf-8') as f:
        json_str = json.dumps(routes_meta, separators=(',', ':'))
        f.write(f"window.loadRoutesData({json_str});")

    # Save individual route files as .js
    saved_count = 0
    for r_id, r_data in routes_full.items():
        if not r_data['d0']['trips'] and not r_data['d1']['trips']:
            continue
        
        relevant_stop_ids = set()
        for d in ['d0', 'd1']:
            # Sort trips by departure time of the first stop
            r_data[d]['trips'].sort(key=lambda x: x['stops'][0]['t'] if x['stops'] else '99:99')
            for t in r_data[d]['trips']:
                for s in t['stops']:
                    relevant_stop_ids.add(s['s'])
        
        route_stops = {sid: stops.get(sid, {'name': sid, 'lat': None, 'lon': None}) for sid in relevant_stop_ids}
        
        final_route_obj = {
            'route': r_data,
            'stops': route_stops
        }

        # Need to handle spaces in route ID for filename
        safe_id = r_id.replace(" ", "_")
        filename = os.path.join(ROUTES_DIR, f"{safe_id}.js")
        
        with open(filename, 'w', encoding='utf-8') as f:
            json_str = json.dumps(final_route_obj, separators=(',', ':'))
            f.write(f"window.loadRouteDetails({json_str});")
            
        saved_count += 1

    print(f"Generated routes.js and {saved_count} route JS files in {DATA_DIR}")

    # --- Generate all_stops.js logic ---
    print("Generating all_stops.js...")
    stops_all = {}
    station_to_routes = defaultdict(list)

    for r_id, r_data in routes_full.items():
        if not r_data['d0']['trips'] and not r_data['d1']['trips']:
            continue
        
        relevant_stop_ids = set()
        for d in ['d0', 'd1']:
            for t in r_data[d]['trips']:
                for s in t['stops']:
                    relevant_stop_ids.add(s['s'])
        
        for sid in relevant_stop_ids:
            if sid not in stops_all:
                stops_all[sid] = stops.get(sid, {'name': sid, 'lat': None, 'lon': None})
            if r_id not in station_to_routes[sid]:
                station_to_routes[sid].append(r_id)

    popular_names_upper = [
        "NEW YORK PENN STATION", "NEWARK PENN STATION", "SECAUCUS JUNCTION",
        "TRENTON TRANSIT CENTER", "HOBOKEN TERMINAL", "NEWARK BROAD ST",
        "ATLANTIC CITY", "METROPARK", "PRINCETON JUNCTION", "HAMILTON", "RAHWAY"
    ]

    for stop_id, stop_info in stops_all.items():
        stop_info['id'] = stop_id
        stop_info['popular'] = stop_info.get('name', '').upper() in popular_names_upper
        stop_info['routes'] = station_to_routes.get(stop_id, [])

    sorted_stops = dict(sorted(stops_all.items(), key=lambda item: item[1].get('name', '')))
    
    with open(os.path.join(DATA_DIR, 'all_stops.js'), 'w', encoding='utf-8') as f:
        f.write('window.loadAllStops(' + json.dumps(sorted_stops) + ');')

    print(f"Done. Generated all_stops.js with {len(sorted_stops)} stops.")

if __name__ == "__main__":
    process_data()
