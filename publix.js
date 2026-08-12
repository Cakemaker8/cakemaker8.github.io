async function finalloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const outputs = document.getElementById('content');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Picture</th><th>Name</th><th>Dates</th><th>Prices</th></tr>';
        options.forEach(item => {
            htmlContent += "<tr><td><img src=\"publix/images/" + item.img + "\" width=\"75\" height=\"75\"></td><td>" + item.name + "</td><td>" + item.dates + "</td><td>" + item.prices + "</td></tr>";
        });
        outputs.innerHTML = htmlContent;
    } catch (error) {
        const outputs = document.getElementById('content');
        outputs.innerHTML = "None found";
        return console.error(error);
    }
}

finalloader("publix/publixtracker.json")