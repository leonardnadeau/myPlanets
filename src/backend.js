import express from 'express';
import path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

  next();
});

app.get('/positions', async (req, res) => {
    try {
        const positions = await getNewPositions();
        res.json(positions);
    }
    catch (error) {
        console.log("Error in /positions route:", error);
        res.status(500).json({ error: "Failed to get positions" });
    }
});

app.get('/speeds', async (req, res) => {
    try {
        const speeds = await getNewSpeeds();
        res.json(speeds);
    }
    catch (error) {
        console.log("Error in /speeds route:", error);
        res.status(500).json({erro: "Failed to get speeds" });
    }
})

function updateCoordinates() {
    exec('python src/coordinates.py');
}

function updateSpeeds() {
    exec('python src/speeds.py');
}

async function getCoordinates() {
    try {
        const jsonString = await fs.promises.readFile("./data/coordinates.json", 'utf8');
        const data = JSON.parse(jsonString);
        return data;
    } catch (err) {
        console.log(`Error reading/parsing coordinates file: ${err}`);
        throw err;
    }
}

const secondInMs = 1000;
async function getNewSpeeds() {
    updateSpeeds();
    await new Promise(resolve => setTimeout(resolve, 10 * secondInMs));

    try {
        const jsonString = await fs.promises.readFile("./data/speeds.json", 'utf8');
        const data = JSON.parse(jsonString);
        return data;
    } catch (err) {
        console.log(`Error reading/parsing speeds file: ${err}`);
        throw err;
    }
}

async function getNewPositions() {
    updateCoordinates();
    await new Promise(resolve => setTimeout(resolve, secondInMs));
    
    let newPositions = {};
    try {
        let distance = 45;
        let coordinates = await getCoordinates();
        for (let body in coordinates) {
            let x = coordinates[body][0];
            let y = coordinates[body][1];

            if (body === 'moon') {
                [x, y] = getXyFromRadius(x, y, 5);
                newPositions[body] = [x, -1 * y, 0.0];
                continue;
            }

            [x, y] = getXyFromRadius(x, y, distance);

            let angle = 0.0;
            newPositions[body] = [x, -1 * y, angle];
            distance += 40;
        }
    } catch (error) {
        console.log("Error getting coordinates:", error);
    }
    return newPositions;
}

function getXyFromRadius(x, y, radius) {
    let ratio = Math.abs(x / y);
    let newX = (ratio * radius) / Math.sqrt( Math.pow(ratio, 2) + 1 );
    let newY = newX / ratio;
    newX *= Math.sign(x);
    newY *= Math.sign(y);
    return [newX, newY];
}

app.listen(5500, () => console.log('Backend running'));