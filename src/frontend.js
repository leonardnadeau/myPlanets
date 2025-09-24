async function updatePositions() {
    const response = await fetch('http://localhost:5500/positions', {
        method:'GET'
    });
    const positions = await response.json();

    for (const [body, data] of Object.entries(positions)) {
        const element = document.getElementById(body);
        element.style.transform = `translate(${data[0]}0px, ${data[1]}0px)`; // rotate(${data[2]})
    }
}

updatePositions()
setInterval(updatePositions, 2 * 60 * 60 * 1000); // 2 * 60 * 60 * 1000