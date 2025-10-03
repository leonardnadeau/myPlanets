from load import systemNames, ts, system, sun
from coordinates import getCoordinates
import json, time
from math import sqrt

from datetime import datetime

sleepTime = 5
auPerSToKmHr = 538552334520

def magnitude(xyz):
    result = 0
    for component in xyz:
        result += component ** 2
    
    return sqrt(result)

def getSpeeds():
    initialCoordinates = {}
    filepathCoordinates = './data/coordinates.json'
    with open(filepathCoordinates, 'r', encoding='utf-8') as f:
        initialCoordinates = json.load(f)

    time.sleep(sleepTime)
    finalCoordinates = {}
    getCoordinates()
    with open(filepathCoordinates, 'r', encoding='utf-8') as f:
        finalCoordinates = json.load(f)

    speeds = {}
    for body, name in zip(system, systemNames):
        velocity = [( (d2 - d1)/sleepTime ) * auPerSToKmHr for d2, d1 in zip(finalCoordinates[name], initialCoordinates[name])]
        speeds[name] = magnitude(velocity)

    filepath = './data/speeds.json'
    with open(filepath, mode='w', encoding='utf-8') as f:
        json.dump(speeds, f, indent=4)

getSpeeds()