function getCoordinates() {
    const { exec } = require('child_process');
    exec('python src/coordinates.py');
}

getCoordinates()