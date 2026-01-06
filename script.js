let field = "";
let program = "";
let subprogram = "";
let type = "";
let filename = "";
let filenamep = "";
let filenamesp = "";
let filenamefinal = "";

let typename = "";
let subprogramname = "";

let favlistname = [];
let favlistcsv = ["\"University name\",\"Degree level\",\"Degree name\"\"\n\""];

// Gets the list of schools (unitid, name)
let schoollist = [];
const fileinfo = "gradschool/info.json";
fetch(fileinfo)
.then(response => {return response.json();})
.then(options => {
    schoollist = options;
})
.catch(error => console.error(error));

function fav(button) {
    if (!favlistname.includes(button.value)) {
        favlistname.push(button.value);
    }
    const outputs = document.getElementById('favlist');
    outputs.innerHTML = "";
    let htmlContent = '<tr><th>Remove from favorites</th><th>University name</th><th>Degree level</th><th>Degree name</th></tr>';
    favlistname.forEach(item => {
        htmlContent += "<tr><td><button onclick=\"unfav(this)\" value=\"" + item + "\">Remove</button></td><td>" + item.split(";")[0] + "</td><td>" + item.split(";")[1] + "</td><td>" + item.split(";")[2] + "</td></tr>";
    });
    outputs.innerHTML = htmlContent;
}

function unfav(button) {
    if (favlistname.includes(button.value)) {
        favlistname = favlistname.filter(item => item != button.value);
    }
    const outputs = document.getElementById('favlist');
    outputs.innerHTML = "";
    let htmlContent = '<tr><th>Remove from favorites</th><th>University name</th><th>Degree level</th><th>Degree name</th></tr>';
    favlistname.forEach(item => {
        htmlContent += "<tr><td><button onclick=\"unfav(this)\" value=\"" + item + "\">Remove</button></td><td>" + item.split(";")[0] + "</td><td>" + item.split(";")[1] + "</td><td>" + item.split(";")[2] + "</td></tr>";
    });
    outputs.innerHTML = htmlContent;
}

// Level options
typeoptions = [{"name":"","class":""},
    {"name":"Masters","class":"m"},
    {"name":"Masters (fully online)","class":"md"},
    {"name":"Masters (partially online)","class":"mpd"},
    {"name":"PhD (research-based)","class":"pr"},
    {"name":"PhD (research-based, fully online)","class":"prd"},
    {"name":"PhD (research-based, partially online)","class":"prpd"},
    {"name":"PhD (professional)","class":"pp"},
    {"name":"PhD (professional, fully online)","class":"ppd"},
    {"name":"PhD (professional, partially online)","class":"pppd"},
    {"name":"PhD (other)","class":"po"},
    {"name":"PhD (other, fully online)","class":"pod"},
    {"name":"PhD (other, partially online)","class":"popd"}
];

// For loading the field
async function fieldloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const selectElement = document.getElementById('fieldsdrop');
        selectElement.innerHTML = '';
        options.forEach(optionText => {
            const newOption = document.createElement('option');
            newOption.textContent = optionText.CIPTitle;
            newOption.value = optionText.CIPCode;
            selectElement.appendChild(newOption);
        });
    } catch (error) {
        return console.error(error);
    }
}

// For loading the program
async function programloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const selectElement = document.getElementById('programsdrop');
        selectElement.innerHTML = '';
        options.forEach(optionText => {
            const newOption = document.createElement('option');
            newOption.textContent = optionText.CIPTitle;
            newOption.value = optionText.CIPCode;
            selectElement.appendChild(newOption);
        });
    } catch (error) {
        return console.error(error);
    }
}

// For loading the subprogram
async function subprogramloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const selectElement = document.getElementById('subprogramsdrop');
        selectElement.innerHTML = '';
        options.forEach(optionText => {
            const newOption = document.createElement('option');
            newOption.textContent = optionText.CIPTitle;
            newOption.value = optionText.CIPCode;
            selectElement.appendChild(newOption);
        });
    } catch (error) {
        return console.error(error);
    }
}

// For loading the list of school
async function finalloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        const outputs = document.getElementById('unilist');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Add to favorites</th><th>University name</th><th>Degree level</th><th>Degree name</th></tr>';
        options.forEach(item => {
            const schoolname = schoollist.find(s => String(s.UNITIT) == String(item.UNITID));
            const favname = schoolname.INSTNM + ";" + typename + ";" + subprogramname;
            htmlContent += "<tr><td><button onclick=\"fav(this)\" value=\"" + favname + "\">Add</button></td><td>" + schoolname.INSTNM + "</td><td>" + typename + "</td><td>" + subprogramname + "</td></tr>";
        });
        outputs.innerHTML = htmlContent;
    } catch (error) {
        const outputs = document.getElementById('unilist');
        outputs.innerHTML = "None found";
        return console.error(error);
    }
}

// Loads the list of degree types, and updates the final list if there is a change
const selEle = document.getElementById('typedrop');
selEle.innerHTML = '';
typeoptions.forEach(optText => {
    const newOptions = document.createElement('option');
    newOptions.textContent = optText.name;
    newOptions.value = optText.class;
    selEle.appendChild(newOptions);
});
selEle.addEventListener('change', function() {
    const selectedValue = this.value;
    typename = selEle.options[selEle.selectedIndex].innerHTML;
    type = selectedValue;
    if (type != "" && field != "" && program != "" && subprogram != "") {
        filenamefinal = "/gradschool/" + type + "/" + field + "/" + program + "/" + subprogram + ".json";
        finalloader(filenamefinal);
    }
});

filename = "gradschool/cipref/fields.json";
fieldloader(filename);

// Loads the list of programs
filenamep = "gradschool/cipref/programs";
const fieldsdrop = document.getElementById('fieldsdrop');
fieldsdrop.addEventListener('change', function() {
    const selectedValue = this.value;
    filenamep = "gradschool/cipref/programs";
    if (selectedValue.length == 1) {
        filenamep = filenamep + "/0" + selectedValue + ".json";
        field = "0" + selectedValue;
    }
    else {
        filenamep = filenamep + "/" + selectedValue + ".json";
        field = selectedValue;
    }
    programloader(filenamep);
    const selectElement = document.getElementById('subprogramsdrop');
    selectElement.innerHTML = '';
    subprogram = "";
    program = "";
    const selectElemen = document.getElementById('unilist');
    selectElemen.innerHTML = '';
});

// Loads the list of subprograms
filenamesp = "gradschool/cipref/subprograms";
const programsdrop = document.getElementById('programsdrop');
programsdrop.addEventListener('change', function() {
    const selectedValue = this.value;
    filenamesp = "gradschool/cipref/subprograms";
    if (selectedValue.length == 1) {
        filenamesp = filenamesp + "/" + field + "/0" + selectedValue + ".json";
        program = "0" + selectedValue;
    }
    else {
        filenamesp = filenamesp + "/" + field + "/" + selectedValue + ".json";
        program = selectedValue;
    }
    subprogramloader(filenamesp);
    const selectElemen = document.getElementById('unilist');
    selectElemen.innerHTML = '';
    subprogram = "";
});

// Loads the list of schools
filenamefinal = "gradschool/" + type + "/" + field + "/" + program;
const subprogramsdrop = document.getElementById('subprogramsdrop');
subprogramsdrop.addEventListener('change', function() {
    const selectedValue = this.value;
    filenamefinal = "gradschool/" + type + "/" + field + "/" + program;
    if (selectedValue.length == 1) {
        filenamefinal = filenamefinal + "/0" + selectedValue + ".json";
        subprogram = "0" + selectedValue;
    }
    else {
        filenamefinal = filenamefinal + "/" + selectedValue + ".json";
        subprogram = selectedValue;
    }
    subprogramname = subprogramsdrop.options[subprogramsdrop.selectedIndex].innerHTML;
    finalloader(filenamefinal);
});

// Exporting favorites to csv file
const exportbutton = document.getElementById('exportbutton');
exportbutton.addEventListener('click', function() {
    favlistcsv = ["\"University name\",\"Degree level\",\"Degree name\"\n"];
    favlistname.forEach(item => {
        favlistcsv.push("\"" + item.split(";")[0] + "\",\"" + item.split(";")[1] + "\",\"" + item.split(";")[2] + "\"\n");
    });
    var blob = new Blob(favlistcsv, {type: 'text/csv;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var pom = document.createElement('a');
    pom.setAttribute("href", url);
    // pom.href = url;
    pom.setAttribute('download', 'export.csv');
    pom.style.display = "none";
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
    URL.revokeObjectURL(url);
});
