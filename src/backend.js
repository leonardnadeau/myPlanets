import express from 'express';
import path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigin = 'http://localhost:5500';

  // Set Access-Control-Allow-Origin to the allowed origin
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

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

app.get('/positions', async (req, res) => {
    try {
        const positions = await getNewPositions();
        res.json(positions);
    } catch (error) {
        console.log("Error in /positions route:", error);
        res.status(500).json({ error: "Failed to get positions" });
    }
});

function updateCoordinates() {
    exec('python src/coordinates.py');
}

const system = ['mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'uranus', 'saturn', 'neptune'];

async function getCoordinates() {
    try {
        const jsonString = await fs.promises.readFile("C:/Users/hungr/Desktop/R-CO-OR/Coding/Personal Projects/Python/pyPlanets/pyPlanets/coordinates.json", 'utf8');
        const data = JSON.parse(jsonString);
        return data;
    } catch (err) {
        console.log(`Error reading/parsing file: ${err}`);
        throw err;
    }
}

async function getNewPositions() {
    updateCoordinates();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let newPositions = {};
    try {
        let coordinates = await getCoordinates();
        for (let body in coordinates) {
            let [x, y] = transformXYZ(coordinates[body]);
            let angle = Math.atan(y/x);
            newPositions[body] = [x, y, angle].map(q => Math.round(q));
        }
    } catch (error) {
        console.log("Error getting coordinates:", error);
    }
    return newPositions;
}

function transformXYZ(xyz) {
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];

    let xFraction = x / (x + y);
    let yFraction = y / (x + y);
    // x += z * xFraction;
    // y += z * yFraction;
    return [x, y];
}

app.listen(5500, () => console.log('Backend running'));
