const encoder = new TextEncoder();
const start = encoder.encode("\x00InventoryItems\x00");
const end = encoder.encode("\x00GPE_States\x00");

function findsubarray(haystack, needle) {
    if (needle.length == 0) return 0;
    if (needle.length > haystack.length) return -1;

    for (let i = 0; i <= haystack.length - needle.length; i++) {
        let found = true;
        for (let j = 0; j < needle.length; j++) {
            if (haystack[i + j] != needle[j]) {
                found = false;
                break;
            }
        }
        if (found) return i;
    }
    return -1;
}

let filecontents = new Uint8Array;
let inventory = new Uint8Array;
// function saveloader() {
//     fetch("e33/EXPEDITION_0.sav")
//     .then(response => { return response.arrayBuffer(); })
//     .then(options => {
//         const bytearray = new Uint8Array(options);
//         filecontents = bytearray;
//         startpos = findsubarray(bytearray, start);
//         endpos = findsubarray(bytearray, end);
//         inventory = bytearray.subarray(startpos, endpos);
//     });
// }


let disclist = [];
const fileinfo = "e33/discs.json";
function discloader() {
    fetch(fileinfo)
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('disclist');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Disc Name</th><th>Found</th></tr>';
        options.forEach(item => {
            const disc = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, disc) != -1) {
                // console.log("found ", item.ingamename);
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

document.getElementById('savefile').addEventListener('input', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const bytearray = new Uint8Array(content);
            console.log(bytearray);
            filecontents = bytearray;
            startpos = findsubarray(bytearray, start);
            endpos = findsubarray(bytearray, end);
            inventory = bytearray.subarray(startpos, endpos);
            discloader();
        };
        reader.readAsArrayBuffer(file);
    }
});


// saveloader();
// discloader();
