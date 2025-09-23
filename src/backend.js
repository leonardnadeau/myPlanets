import express from 'express';
import path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigin = 'http://127.0.0.1:5500/';

  // Set Access-Control-Allow-Origin to the allowed origin
  res.header('Access-Control-Allow-Origin', allowedOrigin);

  // Allow credentials (cookies, auth headers)
  res.header('Access-Control-Allow-Credentials', 'true');

  // Allow specific HTTP methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Allow specific headers
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No content for preflight
  }

  next();
});

app.get('/positions', (req, res) => {
  const positions = getNewPositions();
  res.json(positions);
});

function updateCoordinates() {
    exec('python src/coordinates.py');
}

const system = ['mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'uranus', 'saturn', 'neptune'];

function getCoordinates() {
    fs.readFile("C:/Users/hungr/Desktop/R-CO-OR/Coding/Personal Projects/Python/pyPlanets/pyPlanets/coordinates.json", 'utf8', (err, jsonString) => {
        if (err) {
            console.log(`Error reading: ${err}`);
            console.log(jsonString);
            return;
        }
        try {
            const data = JSON.parse(jsonString);
            return data;
        }
        catch (error) {
            console.log(`Error parsing: ${error}`)
            console.log(jsonString);
        }
    });
}

function getNewPositions() {
    updateCoordinates();
    let newPositions = {};
    let coordinates = getCoordinates()
    for (body in coordinates) {
        let [x, y] = transformXYZ(coordinates[body]);
        let angle = Math.atan(y/x);
        newPositions[body] = [x, y, angle].map(q => Math.round(q));
    }
    return newPositions;
}

function transformXYZ(xyz) {
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];

    let xFraction = x / (x + y);
    let yFraction = y / (x + y);
    x += z * xFraction;
    y += z * yFraction;
    return [x, y];
}

app.listen(5500, () => console.log('Backend running'));
