from load import planets, planetNames, sun, ts, moon, earth
import json

def getCoordinates():
    t = ts.now()

    coordinates = {}
    for body, name in zip(planets, planetNames):
        coordinates[name] = [float(component) for component in sun.at(t).observe(body).position.au]
    coordinates['moon'] = [float(component) for component in earth.at(t).observe(moon).position.au]
    
    filepath = './data/coordinates.json'
    with open(filepath, mode='w', encoding='utf-8') as f:
        json.dump(coordinates, f, indent=4)

getCoordinates()