async function updatePositions() {
    const response = await fetch('http://localhost:5500/positions', {
        method:'GET'
    });
    const positions = await response.json();

    for (const [body, data] of Object.entries(positions)) {
        const element = document.getElementById(body);
        if (body === 'moon') {
            element.style.transform = `translate(${data[0] * 4.5}0px, ${data[1] * 4.5}px)`;
            continue;
        }
        element.style.transform = `translate(${data[0]}0px, ${data[1]}0px)`; // rotate(${data[2]})
    }
}

let distance = 90;
for (let orbit of document.getElementsByClassName('orbit-planet')) {
    orbit.style.width = `${distance}px`;
    orbit.style.height = `${distance}px`;
    distance += 80;
}

let isOrbitsOn = true;
function toggleOrbits() {
    isOrbitsOn = !isOrbitsOn;
    if (isOrbitsOn) {
        document.getElementsByClassName('orbit-planet').style.display = block;        document.getElementsByClassName('orbit-planet').style.display = block;
        document.getElementsByClassName('orbit-moon').style.display = block;
    }
    else {
        document.getElementsByClassName('orbit-planet').style.display = none;        document.getElementsByClassName('orbit-planet').style.display = block;
        document.getElementsByClassName('orbit-moon').style.display = none;
    }
}

updatePositions();
setInterval(updatePositions, 10 * 1000); // 2 * 60 * 60 * 1000