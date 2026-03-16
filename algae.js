let month = "";
let day = "";
let data = "";
let name = "";

monthoptions = [{"name":"","class":""},
    {"name":"March","class":"3"},
    {"name":"April","class":"4"}
];
dayoptions = [{"name":"","class":""},
    {"name":"12","class":"12"},
    {"name":"13","class":"13"}
];
dataoptions = [{"name":"","class":""},
    {"name":"1","class":"1"},
    {"name":"2","class":"2"}
];

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
    const selectedValue = this.value;
    month = selectedValue;
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
    const selectedValue = this.value;
    day = selectedValue;
});

// Gets the data
const dataele = document.getElementById('datadrop');
dataele.innerHTML = '';
dataoptions.forEach(optText => {
    const newOptions = document.createElement('option');
    newOptions.textContent = optText.name;
    newOptions.value = optText.class;
    dataele.appendChild(newOptions);
});
dataele.addEventListener('change', function() {
    const selectedValue = this.value;
    data = selectedValue;
    finalloader("algae/" + month + "/" + day + "/" + data + ".json");
});

// For loading the data
async function finalloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const outputs = document.getElementById('datatable');
        outputs.innerHTML = "";
        const formattedJson = JSON.stringify(options, null, 2);
        outputs.innerHTML = formattedJson;
        // let htmlContent = '<tr><th>Name</th><th>Value</th></tr>';
        // options.forEach(item => {
        //     const schoolname = schoollist.find(s => String(s.UNITIT) == String(item.UNITID));
        //     htmlContent += "<tr><td>" + item.name + "</td><td>" + subprogramname + "</td></tr>";
        // });
        // outputs.innerHTML = htmlContent;
    } catch (error) {
        const outputs = document.getElementById('datatable');
        outputs.innerHTML = "None found";
        return console.error(error);
    }
}