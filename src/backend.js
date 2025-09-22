function updateCoordinates() {
    const { exec } = require('child_process');
    exec('python src/coordinates.py');
}

const system = ['mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'uranus', 'saturn', 'neptune'];

const fs = require('fs/promises');
const path = require('path');

async function getCoordinates() {
  try {
    const filePath = path.join(__dirname, '../coordinates.json');
    const jsonString = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonString);
    return data;
  } catch (err) {
    console.error('Error loading JSON:', err);
  }
}

function getNewPositions() {
    updateCoordinates();
    let newPositions = {};
    getCoordinates().then(coordinates => {
        for (body in coordinates) {
            let [x, y] = transformXYZ(coordinates[body]);
            let left =  `calc(${x} * 1%)`;
            let top = `calc(${y} * 1%)`;
            let angle = Math.atan(y/x);
            newPositions[body] = [left, top, angle];
        }
    });
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

getNewPositions();