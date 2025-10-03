from skyfield.api import load

bodies = load('de440.bsp')

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

planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]
system = planets
system.extend([moon])
planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']
systemNames = planetNames
systemNames.extend(['moon'])