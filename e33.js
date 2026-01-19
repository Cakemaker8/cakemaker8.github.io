const encoder = new TextEncoder();
const start = encoder.encode("\x00InventoryItems\x00");
const end = encoder.encode("\x00GPE_States\x00");
const levelstart = encoder.encode("\x00WeaponProgressions\x00");
const levelend = encoder.encode("\x00InteractedDialogues\x00");

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
let levels = new Uint8Array;


const discinfo = "e33/discs.json";
function discloader() {
    fetch(discinfo)
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('disclist');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Disc Name</th><th>Found</th><th>Location</th></tr>';
        options.forEach(item => {
            const disc = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, disc) != -1) {
                // console.log("found ", item.ingamename);
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

const journalinfo = "e33/journals.json";
function journalloader() {
    fetch(journalinfo)
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('journallist');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Journal Name</th><th>Found</th><th>Location</th></tr>';
        options.forEach(item => {
            const journal = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, journal) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

const pictosinfo = "e33/pictos.json";
function pictosloader() {
    fetch(pictosinfo)
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('pictoslist');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Pictos Name</th><th>Found</th><th>Level</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const pictos = encoder.encode("\x00"+item.name+"\x00");
            const pictosl = encoder.encode("\x00"+item.name+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            if (findsubarray(inventory, pictos) != -1) {
                const pictosloc = findsubarray(levels, pictosl);
                const pictosinfo = levels.subarray(pictosloc,pictosloc+pictosl.length + 1)
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td>" + pictosinfo[pictosinfo.length-1] + "</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td></td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function weaponsvloader() {
    fetch("e33/weaponsverso.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('versoweapons');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Weapon Name</th><th>Found</th><th>Level</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const weapon = encoder.encode("\x00"+item.name+"\x00");
            const weaponl = encoder.encode("\x00"+item.name+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            if (findsubarray(inventory, weapon) != -1) {
                const weaponloc = findsubarray(levels, weaponl);
                const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td>" + weaponinfo[weaponinfo.length-1] + "</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td></td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function weaponslloader() {
    fetch("e33/weaponslune.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('luneweapons');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Weapon Name</th><th>Found</th><th>Level</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const weapon = encoder.encode("\x00"+item.name+"\x00");
            const weaponl = encoder.encode("\x00"+item.name+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            if (findsubarray(inventory, weapon) != -1) {
                const weaponloc = findsubarray(levels, weaponl);
                const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td>" + weaponinfo[weaponinfo.length-1] + "</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td></td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function weaponsmloader() {
    fetch("e33/weaponsmaelle.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('maelleweapons');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Weapon Name</th><th>Found</th><th>Level</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const weapon = encoder.encode("\x00"+item.name+"\x00");
            const weaponl = encoder.encode("\x00"+item.name+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            if (findsubarray(inventory, weapon) != -1) {
                const weaponloc = findsubarray(levels, weaponl);
                const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td>" + weaponinfo[weaponinfo.length-1] + "</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td></td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function weaponssloader() {
    fetch("e33/weaponssciel.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('scielweapons');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Weapon Name</th><th>Found</th><th>Level</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const weapon = encoder.encode("\x00"+item.name+"\x00");
            const weaponl = encoder.encode("\x00"+item.name+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            if (findsubarray(inventory, weapon) != -1) {
                const weaponloc = findsubarray(levels, weaponl);
                const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td>" + weaponinfo[weaponinfo.length-1] + "</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td></td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function weaponscloader() {
    fetch("e33/weaponsmonoco.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('monocoweapons');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Weapon Name</th><th>Found</th><th>Level</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const weapon = encoder.encode("\x00"+item.name+"\x00");
            const weaponl = encoder.encode("\x00"+item.name+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            if (findsubarray(inventory, weapon) != -1) {
                const weaponloc = findsubarray(levels, weaponl);
                const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td>" + weaponinfo[weaponinfo.length-1] + "</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td></td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function hairg() {
    fetch("e33/hairgustave.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('gustavehair');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Hair Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const hair = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, hair) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function hairv() {
    fetch("e33/hairverso.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('versohair');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Hair Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const hair = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, hair) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function hairl() {
    fetch("e33/hairlune.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('lunehair');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Hair Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const hair = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, hair) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function hairm() {
    fetch("e33/hairmaelle.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('maellehair');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Hair Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const hair = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, hair) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function hairs() {
    fetch("e33/hairsciel.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('scielhair');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Hair Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const hair = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, hair) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function hairc() {
    fetch("e33/hairmonoco.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('monocohair');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Hair Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const hair = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, hair) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function outfitg() {
    fetch("e33/outfitgustave.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('gustaveoutfits');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Outfit Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const outfit = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, outfit) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function outfitv() {
    fetch("e33/outfitverso.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('versooutfits');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Outfit Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const outfit = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, outfit) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function outfitl() {
    fetch("e33/outfitlune.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('luneoutfits');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Outfit Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const outfit = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, outfit) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function outfitm() {
    fetch("e33/outfitmaelle.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('maelleoutfits');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Outfit Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const outfit = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, outfit) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function outfits() {
    fetch("e33/outfitsciel.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('scieloutfits');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Outfit Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const outfit = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, outfit) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function outfitc() {
    fetch("e33/outfitmonoco.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('monocooutfits');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Outfit Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const outfit = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, outfit) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}

function monocoskills() {
    fetch("e33/monocoskills.json")
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById('monocoskills');
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Skill Name</th><th>Found</th><th>Wiki</th></tr>';
        options.forEach(item => {
            const skill = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, skill) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
    })
    .catch(error => console.error(error));
}


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
} 


document.getElementById('savefile').addEventListener('input', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const bytearray = new Uint8Array(content);
            filecontents = bytearray;
            startpos = findsubarray(bytearray, start);
            endpos = findsubarray(bytearray, end);
            startlpos = findsubarray(bytearray, levelstart);
            endlpos = findsubarray(bytearray, levelend);
            inventory = bytearray.subarray(startpos, endpos);
            levels = bytearray.subarray(startlpos, endlpos);
            discloader();
            journalloader();
            pictosloader();
            weaponsvloader();
            weaponslloader();
            weaponsmloader();
            weaponssloader();
            weaponscloader();
            hairg();
            hairv();
            hairl();
            hairm();
            hairs();
            hairc();
            outfitg();
            outfitv();
            outfitl();
            outfitm();
            outfits();
            outfitc();
            monocoskills();
        };
        reader.readAsArrayBuffer(file);
    }
});

