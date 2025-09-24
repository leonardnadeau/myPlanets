async function updatePositions() {
    const response = await fetch('http://localhost:5500/positions', {
        method:'GET',
        
    });
    const positions = await response.json();

    for (const [body, data] of Object.entries(positions)) {
        const element = document.getElementById(body);

        element.style.left = data[0] + '0px'; // `calc(1% * ${-1 *data[0]})`;
        element.style.top = data[1] + '0px'; // `calc(1% * ${-1 *data[1]})`;
        // element.style.transform = `rotate(${data[2]})`;
    }
}

updatePositions()
setInterval(updatePositions, 1000); // 10 * 60 * 1000