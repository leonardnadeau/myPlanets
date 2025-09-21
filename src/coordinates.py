from skyfield.api import load
from load import system, names, sun, ts
import json

def getCoordinates():
    t = ts.now()

    coordinates = {}
    for body, name in zip(system, names):
        coordinates[name] = [float(component) for component in sun.at(t).observe(body).position.au]
    
    filepath = './coordinates.json'
    with open(filepath, mode='w', encoding='utf-8') as f:
        json.dump(coordinates, f, indent=4)

getCoordinates()