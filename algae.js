let month = "";
let day = "";
let time = "";

monthoptions = [];
dayoptions = [];
timeoptions = [];

// For loading the months
async function monthloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const selectElement = document.getElementById('monthdrop');
        selectElement.innerHTML = '';
        options.forEach(optionText => {
            const newOption = document.createElement('option');
            newOption.textContent = optionText.month;
            newOption.value = optionText.filename;
            selectElement.appendChild(newOption);
        });
    } catch (error) {
        return console.error(error);
    }
}

// For loading the days
async function dayloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const selectElement = document.getElementById('daydrop');
        selectElement.innerHTML = '';
        options.forEach(optionText => {
            const newOption = document.createElement('option');
            newOption.textContent = optionText.day;
            newOption.value = optionText.filename;
            selectElement.appendChild(newOption);
        });
    } catch (error) {
        return console.error(error);
    }
}

// For loading the time
async function timeloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const selectElement = document.getElementById('timedrop');
        selectElement.innerHTML = '';
        options.forEach(optionText => {
            const newOption = document.createElement('option');
            newOption.textContent = optionText.time;
            newOption.value = optionText.filename;
            selectElement.appendChild(newOption);
        });
    } catch (error) {
        return console.error(error);
    }
}

// Initial loading of months
monthloader("algae/months.json")

// Gets the month
const monthele = document.getElementById('monthdrop');
monthele.innerHTML = '';
monthoptions.forEach(optText => {
    const newOptions = document.createElement('option');
    newOptions.textContent = optText.name;
    newOptions.value = optText.class;
    monthele.appendChild(newOptions);
});
monthele.addEventListener('change', function() {
    // Reset view
    const outputs = document.getElementById('datatable');
    outputs.innerHTML = "";
    // Reset days
    const selEle = document.getElementById('daydrop');
    selEle.innerHTML = '';
    day = "";
    // Reset times
    const selEl = document.getElementById('timedrop');
    selEl.innerHTML = '';
    time = "";
    // Loading the month
    const selectedValue = this.value;
    month = selectedValue;
    // Getting the days
    dayloader("algae/" + month + "/days.json")
});

// Gets the day
const dayele = document.getElementById('daydrop');
dayele.innerHTML = '';
dayoptions.forEach(optText => {
    const newOptions = document.createElement('option');
    newOptions.textContent = optText.name;
    newOptions.value = optText.class;
    dayele.appendChild(newOptions);
});
dayele.addEventListener('change', function() {
    // Reset view
    const outputs = document.getElementById('datatable');
    outputs.innerHTML = "";
    // Reset times
    const selEl = document.getElementById('timedrop');
    selEl.innerHTML = '';
    time = "";
    // Loading the day
    const selectedValue = this.value;
    day = selectedValue;
    // Getting the times
    timeloader("algae/" + month + "/" + day + "/times.json")
});

// Gets the time
const timeele = document.getElementById('timedrop');
timeele.innerHTML = '';
timeoptions.forEach(optText => {
    const newOptions = document.createElement('option');
    newOptions.textContent = optText.name;
    newOptions.value = optText.class;
    timeele.appendChild(newOptions);
});
timeele.addEventListener('change', function() {
    const selectedValue = this.value;
    time = selectedValue;
    finalloader("algae/" + month + "/" + day + "/" + time + ".json");
});

// For loading the data
async function finalloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const outputs = document.getElementById('datatable');
        outputs.innerHTML = "";
        let htmlContent = "<tr><th>Parameter</th><th>Value</th></tr>";
        const dataObj = options[0];
        for (const key in dataObj) {
            const label = key.replace("_avg", "").replaceAll("_", " ");
            const value = Number(dataObj[key]).toFixed(2);
            htmlContent += "<tr><td>" + label + "</td><td>" + value + "</td></tr>";
        }
        outputs.innerHTML = htmlContent;
    } catch (error) {
        const outputs = document.getElementById('datatable');
        outputs.innerHTML = "None found";
        return console.error(error);
    }
}