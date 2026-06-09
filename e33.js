// This is used to make the buttons show the tables
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

// Various variables for the save parser
const encoder = new TextEncoder();
const start = encoder.encode("\x00InventoryItems\x00");
const end = encoder.encode("\x00GPE_States\x00");
const levelstart = encoder.encode("\x00WeaponProgressions\x00");
const levelend = encoder.encode("\x00InteractedDialogues\x00");
let filecontents = new Uint8Array;
let inventory = new Uint8Array;
let levels = new Uint8Array;

// This is used to find the item's name in the save file (needle in haystack problem)
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

// This gets the pictos and weapons
let weaponfilelist = ["e33/pictos.json", "e33/weaponsverso.json", "e33/weaponslune.json", "e33/weaponsmaelle.json",
    "e33/weaponssciel.json", "e33/weaponsmonoco.json"];
let weaponhtmllist = ['pictoslist', 'versoweapons', 'luneweapons', 'maelleweapons', 'scielweapons', 'monocoweapons'];
let weaponamountlist = [210, 29, 26, 26, 25, 15];
function weaponsloader(filename, htmlname, amountlist) {
    fetch(filename)
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById(htmlname);
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Name</th><th>Found</th><th>Level</th><th>Wiki</th></tr>';
        let curamount = 0;
        let curmaxamount = 0;
        options.forEach(item => {
            const weapon = encoder.encode("\x00"+item.name+"\x00");
            const weaponl = encoder.encode("\x00"+item.name+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            if (findsubarray(inventory, weapon) != -1) {
                const weaponloc = findsubarray(levels, weaponl);
                const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td>" + weaponinfo[weaponinfo.length-1] + "</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                curamount += 1;
                if (weaponinfo[weaponinfo.length-1] == 33) {
                    curmaxamount += 1;
                }
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td></td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
        document.getElementById(htmlname+"amount").innerHTML = "Amount found: " + curamount + "/" + amountlist + "; max level: " + curmaxamount + "/" + amountlist;
    })
    .catch(error => console.error(error));
}

// This gets the discs, journals, outfits, and hairstyles
let hairfilelist = ["e33/discs.json", "e33/journals.json", 
    "e33/outfitgustave.json", "e33/outfitverso.json", "e33/outfitlune.json", "e33/outfitmaelle.json",
    "e33/outfitsciel.json", "e33/outfitmonoco.json",
    "e33/hairgustave.json", "e33/hairverso.json", "e33/hairlune.json", "e33/hairmaelle.json",
    "e33/hairsciel.json", "e33/hairmonoco.json", "e33/monocoskills.json"];
let hairhtmllist = ['disclist', 'journallist',
    'gustaveoutfits', 'versooutfits', 'luneoutfits', 'maelleoutfits', 'scieloutfits', 'monocooutfits',
    'gustavehair', 'versohair', 'lunehair', 'maellehair', 'scielhair', 'monocohair', 'monocoskills'];
let hairamountlist = [33, 49, 13, 17, 14, 15, 14, 9, 15, 16, 23, 27, 23, 12, 44];
function hairloader(filename, htmlname, amountlist) {
    fetch(filename)
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById(htmlname);
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Name</th><th>Found</th><th>Wiki</th></tr>';
        let curamount = 0;
        options.forEach(item => {
            const hair = encoder.encode("\x00"+item.name+"\x00");
            if (findsubarray(inventory, hair) != -1) {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                curamount += 1;
            }
            else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
            }
        });
        outputs.innerHTML = htmlContent;
        document.getElementById(htmlname+"amount").innerHTML = "Amount found: " + curamount + "/" + amountlist;
    })
    .catch(error => console.error(error));
}

// Loads the save file and finds everything in it
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
            for (var i = 0; i < weaponfilelist.length; i++) {
                weaponsloader(weaponfilelist[i], weaponhtmllist[i], weaponamountlist[i]);
            }
            for (var i = 0; i < hairfilelist.length; i++) {
                hairloader(hairfilelist[i], hairhtmllist[i], hairamountlist[i]);
            }
        };
        reader.readAsArrayBuffer(file);
    }
});
