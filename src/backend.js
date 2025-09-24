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
            x = Math.pow(Math.abs(x), 1/3) * 50 * Math.sign(x);
            y = Math.pow(Math.abs(y), 1/3) * 50 * Math.sign(y);
            let angle = Math.atan(y/x);
            newPositions[body] = [x, y, angle];
        }
    } catch (error) {
        console.log("Error getting coordinates:", error);
    }
    return newPositions;
}

function transformXYZ(xyz) {
    let distance = Math.sqrt(Math.pow(xyz[0], 2) + Math.pow(xyz[1], 2) + Math.pow(xyz[2], 2));

    let left = xyz[0];
    let top = xyz[1];
    let leftFraction = Math.abs(left) / (Math.abs(left) + Math.abs(top));
    let topFraction = 1 - leftFraction;

    left += leftFraction * xyz[0] * Math.sign(left);
    top += topFraction * xyz[0] * Math.sign(top);

    let distance2 = Math.sqrt(Math.pow(left, 2) + Math.pow(top, 2));
    return [left, top];
}

app.listen(5500, () => console.log('Backend running'));
