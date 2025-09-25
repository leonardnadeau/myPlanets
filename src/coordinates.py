from skyfield.api import load
from load import system, names, sun, ts, moon, earth
import json

def getCoordinates():
    t = ts.now()

    coordinates = {}
    for body, name in zip(system, names):
        coordinates[name] = [float(component) for component in sun.at(t).observe(body).position.au]
    coordinates['moon'] = [float(component) for component in earth.at(t).observe(moon).position.au]
    
    filepath = './coordinates.json'
    with open(filepath, mode='w', encoding='utf-8') as f:
        json.dump(coordinates, f, indent=4)

getCoordinates()