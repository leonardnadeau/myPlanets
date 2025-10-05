async function updatePositions() {
    const response = await fetch('http://localhost:5500/positions', {
        method:'GET'
    });
    const positions = await response.json();

    for (const [body, data] of Object.entries(positions)) {
        const element = document.getElementById(body);
        if (body === 'moon') {
            element.style.transform = `translate(${data[0] * 4.5}px, ${data[1] * 4.5}px)`;
            continue;
        }
        element.style.transform = `translate(${data[0]}px, ${data[1]}px)`; // rotate(${data[2]})
    }
}

async function updateSpeeds() {
    const response = await fetch('http://localhost:5500/speeds', {
        method: 'GET'
    });
    const speeds = await response.json();

    for (const [body, data] of Object.entries(speeds)) {
        const element = document.getElementById(body);
        let speedElement = element.querySelector('.speed');
        let speedString = String(data.toFixed(0));
        let stringLen = speedString.length;
        if (stringLen > 4) {
            while (stringLen > 3) {
                stringLen -= 3;

                speedString = speedString.slice(0, stringLen) + ' ' + speedString.slice(stringLen);
            }
        }
        speedElement.innerHTML = speedString + ' ';
    }
}

let distance = 90;
for (let orbit of document.getElementsByClassName('orbit-planet')) {
    orbit.style.width = `${distance}px`;
    orbit.style.height = `${distance}px`;
    distance += 80;
}

function infoFunctions() {
    document.querySelectorAll('.body').forEach(body => {
        let clickElement = body.querySelector('.click-text');
        let infoElement = clickElement.querySelector('.info-container');
        clickElement.addEventListener('click', function() {
            if (infoElement.style.display === 'block') {
                infoElement.style.display = 'none';
                body.style.zIndex = '';
                if (body.id === 'moon') {
                    document.getElementById('earth').style.zIndex = '';
                }
            }
            else {
                document.querySelectorAll('.info-container').forEach(function(otherInfoElement) {
                    otherInfoElement.style.display = 'none';
                    otherInfoElement.closest('.body').style.zIndex = '';
                });
                infoElement.style.display = 'block';
                document.getElementById('earth').style.zIndex = '';

                if (body.id === 'moon') {
                    document.getElementById('earth').style.zIndex = '1000';
                    body.style.zIndex = '10';
                } else {
                    body.style.zIndex = '1000';
                }

            }
        });
    });
}

const hourInMs = 60 * 60 * 1000;
function init() {
    updatePositions();
    infoFunctions();
    updateSpeeds();
    setInterval(updatePositions, 2 * 60 * 60 * 1000);
    setInterval(updateSpeeds, 2 * 60 * 60 * 1000);
}

init();