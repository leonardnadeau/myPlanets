from skyfield.api import load
from load import bodies

ts = load.timescale()

sun = bodies['sun']
mercury = bodies['mercury barycenter']
venus = bodies['venus barycenter']
earth = bodies['earth barycenter']
moon = bodies['moon']
mars = bodies['mars barycenter']
jupiter = bodies['jupiter barycenter']
saturn = bodies['saturn barycenter']
uranus = bodies['uranus barycenter']
neptune = bodies['neptune barycenter']

system = [mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune]

def getCoordinates():
    t = ts.now()

    coordinates = []
    for body in system:
        coordinates.append(sun.at(t).observe(body).position.au) 
    
    return coordinates 

print(getCoordinates())