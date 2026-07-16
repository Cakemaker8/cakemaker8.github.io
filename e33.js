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
        document.getElementById(htmlname+"amount").innerHTML = "\tAmount found: " + curamount + "/" + amountlist + "; max level: " + curmaxamount + "/" + amountlist;
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
let hairamountlist = [33, 49, 16, 20, 16, 18, 16, 11, 16, 17, 24, 28, 24, 13, 44];
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
        document.getElementById(htmlname+"amount").innerHTML = "\tAmount found: " + curamount + "/" + amountlist;
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


// Save Editor
let type = "";
let chare = "";
let iteme = "";
let levelin = "";
let amountin = "";
let typename = "";
let charname = "";
let itemname = "";
typeoptions = [{"name":"","class":""},
    {"name":"Weapon","class":"weapons"},
    {"name":"Outfit","class":"outfit"},
    {"name":"Hair Style","class":"hair"},
    {"name":"Music Record","class":"discs"},
    {"name":"Journal","class":"journals"},
    {"name":"Pictos","class":"pictos"},
    {"name":"Tint/Upgrade","class":"upgrade"}
];
charoptions = [{"name":"","class":""},
    {"name":"Gustave","class":"gustave"},
    {"name":"Lune","class":"lune"},
    {"name":"Maelle","class":"maelle"},
    {"name":"Sciel","class":"sciel"},
    {"name":"Verso","class":"verso"},
    {"name":"Monoco","class":"monoco"}
];

async function jsonloader(fn) {
    try {
        const response = await fetch(fn);
        const options = await response.json();
        document.getElementById('itemdrop').innerHTML = '';
        const newOption = document.createElement('option');
        newOption.textContent = "";
        newOption.value = "";
        document.getElementById('itemdrop').appendChild(newOption);
        options.forEach(optionText => {
            const newOption = document.createElement('option');
            newOption.textContent = optionText.ingamename;
            newOption.value = optionText.name;
            document.getElementById('itemdrop').appendChild(newOption);
        });
    } catch (error) {
        return console.error(error);
    }
}

typeoptions.forEach(optText => {
    const newOptions = document.createElement('option');
    newOptions.textContent = optText.name;
    newOptions.value = optText.class;
    document.getElementById('typedrop').appendChild(newOptions);
});

document.getElementById('typedrop').addEventListener('change', function() {
    const selectedValue = this.value;
    typename = document.getElementById('typedrop').options[document.getElementById('typedrop').selectedIndex].innerHTML;
    type = selectedValue;
    chare = "";
    charname = "";

    // Set character dropdown (if required)
    document.getElementById('chardrop').innerHTML = "";
    if (type == "weapons" || type == "outfit" || type == "hair") {
        charoptions.forEach(optText => {
            const newOptions = document.createElement('option');
            newOptions.textContent = optText.name;
            newOptions.value = optText.class;
            document.getElementById('chardrop').appendChild(newOptions);
        });
    }

    // Set item dropdown
    document.getElementById('itemdrop').innerHTML = "";
    if ((type == "outfit" || type == "hair") && chare != "") {
        jsonloader("e33/" + type + chare + ".json");
    }
    else if (type == "weapons" && chare != "") {
        if (chare == "gustave") {chare = "verso";}
        jsonloader("e33/" + type + chare + ".json");
    }
    else if (type == "discs" || type == "journals" || type == "pictos" || type == "upgrade") {
        jsonloader("e33/" + type + ".json");
    }
});

document.getElementById('chardrop').addEventListener('change', function() {
    const selectedValue = this.value;
    charname = document.getElementById('chardrop').options[document.getElementById('chardrop').selectedIndex].innerHTML;
    chare = selectedValue;

    // Set item dropdown
    document.getElementById('itemdrop').innerHTML = "";
    if ((type == "outfit" || type == "hair") && chare != "") {
        jsonloader("e33/" + type + chare + ".json");
    }
    else if (type == "weapons" && chare != "") {
        if (chare == "gustave") {chare = "verso";}
        jsonloader("e33/" + type + chare + ".json");
    }
});

document.getElementById('itemdrop').addEventListener('change', function() {
    const selectedValue = this.value;
    itemname = document.getElementById('itemdrop').options[document.getElementById('itemdrop').selectedIndex].innerHTML;
    iteme = selectedValue;
});

document.getElementById('leveldrop').addEventListener('input', function() {
    const selectedValue = this.value;
    levelin = selectedValue;
});

document.getElementById('amountdrop').addEventListener('input', function() {
    const selectedValue = this.value;
    amountin = selectedValue;
});

function insertBytes(array, index, bytesToInsert) {
    const result = new Uint8Array(array.length + bytesToInsert.length);

    result.set(array.subarray(0, index), 0);
    result.set(bytesToInsert, index);
    result.set(array.subarray(index), index + bytesToInsert.length);

    return result;
}

function addUint32(view, offset, amount) {
    const value = view.getUint32(offset, true);
    view.setUint32(offset, value + amount, true);
}

function addUint64(view, offset, amount) {
    const value = view.getBigUint64(offset, true);
    view.setBigUint64(offset, value + BigInt(amount), true);
}

// If there is no level with the item, use this function
function addSimpleItem(numamount, iteme) {
    // string to add should be hex length in 8 bits, name + \x00, hex amount in 8 bits, little endian
    // Finds the end of the inventory
    const inventoryend = findsubarray(filecontents, encoder.encode("\x05\x00\x00\x00Gold\x00"));
    // Length part
    const lenBytes = new Uint8Array(4);
    new DataView(lenBytes.buffer).setUint32(0, iteme.length+1, true);
    // Name part
    const nameBytes = encoder.encode(iteme+"\x00");
    // Number part
    const numBytes = new Uint8Array(4);
    new DataView(numBytes.buffer).setUint32(0, numamount, true);
    // String to add
    const stringtoadd = new Uint8Array(lenBytes.length+nameBytes.length+numBytes.length);
    stringtoadd.set(lenBytes);
    stringtoadd.set(nameBytes, lenBytes.length);
    stringtoadd.set(numBytes, lenBytes.length+nameBytes.length)
    // Add it all
    filecontents = insertBytes(filecontents, inventoryend, stringtoadd);

    // Also need to change the start of inventoryitems
    const view = new DataView(filecontents.buffer);
    const inventorystart = findsubarray(filecontents, encoder.encode("\x00InventoryItems\x00"));
    const intstart = findsubarray(inventory, encoder.encode("\x00IntProperty\x00"));
    addUint64(view, inventorystart+intstart+17, stringtoadd.length);
    addUint32(view, inventorystart+intstart+26, 1);
}

// For adding a level to an item already acquired
function addLevelItem(numamount, iteme) {
    // Need to modify the level
    const view = new DataView(filecontents.buffer);
    const inventorystart = findsubarray(filecontents, encoder.encode("\x00WeaponProgressions\x00"));
    const levelitem = encoder.encode("\x00" + iteme + "\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
    const intstart = findsubarray(levels, levelitem);
    view.setUint32(inventorystart+intstart+levelitem.length, numamount, true);
}

// Adding a level to an item that has not already been acquired
function addlevelItemNew(numamount, iteme) {
    // Need to add new item
    inventoryend = findsubarray(filecontents, encoder.encode("\x14\x00\x00\x00InteractedDialogues\x00"));
    // Start
    const startBytes = encoder.encode("\x30\x00\x00\x00DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A\x00\x0D\x00\x00\x00NameProperty\x00\x00\x00\x00\x00");
    // len+4
    const len4Bytes = new Uint8Array(4);
    new DataView(len4Bytes.buffer).setUint32(0, iteme.length+5, true);
    // Extra 00
    const extra0 = encoder.encode("\x00");
    // len
    const lenBytes = new Uint8Array(4);
    new DataView(lenBytes.buffer).setUint32(0, iteme.length+1, true);
    // Weapon name
    const weaponBytes = encoder.encode(iteme+"\x00\x30\x00\x00\x00CurrentLevel_6_227A00644D035BDD595B2D86C8455B71\x00\x0C\x00\x00\x00IntProperty\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
    // Weapon level
    const levelBytes = new Uint8Array(4);
    new DataView(levelBytes.buffer).setUint32(0, numamount, true);
    // Ending
    const endingBytes = encoder.encode("\x05\x00\x00\x00None\x00");
    // String to add
    const stringtoadd = new Uint8Array(startBytes.length+len4Bytes.length+extra0.length+lenBytes.length+weaponBytes.length+levelBytes.length+endingBytes.length);
    stringtoadd.set(startBytes);
    stringtoadd.set(len4Bytes, startBytes.length);
    stringtoadd.set(extra0, startBytes.length+len4Bytes.length);
    stringtoadd.set(lenBytes, startBytes.length+len4Bytes.length+extra0.length);
    stringtoadd.set(weaponBytes, startBytes.length+len4Bytes.length+extra0.length+lenBytes.length);
    stringtoadd.set(levelBytes, startBytes.length+len4Bytes.length+extra0.length+lenBytes.length+weaponBytes.length);
    stringtoadd.set(endingBytes, startBytes.length+len4Bytes.length+extra0.length+lenBytes.length+weaponBytes.length+levelBytes.length);
    // Add it all
    filecontents = insertBytes(filecontents, inventoryend, stringtoadd);

    // Need to change the start of weaponprogressions
    const view = new DataView(filecontents.buffer);
    const inventorystart = findsubarray(filecontents, encoder.encode("\x00WeaponProgressions\x00"));
    const intstartstr = encoder.encode("d2b2ef26131f\x00\x00\x00\x00\x00")
    const intstart = findsubarray(levels, intstartstr);
    addUint32(view, inventorystart+intstart+intstartstr.length, stringtoadd.length);
    addUint32(view, inventorystart+intstart+intstartstr.length+5, 1);
}

// Adding a new amount to an item
function addAmount(numamount, iteme) {
    const view = new DataView(filecontents.buffer);
    const inventorystart = findsubarray(filecontents, encoder.encode("\x00InventoryItems\x00"));
    const levelitem = encoder.encode("\x00" + iteme + "\x00");
    const intstart = findsubarray(inventory, levelitem);
    view.setUint32(inventorystart+intstart+levelitem.length, numamount, true);
}

document.getElementById('addtosave').addEventListener('click', function(event) {
    // Adding
    if ((type == "outfit" || type == "hair") && chare != "" && iteme != "") {
        // First need to see if the item exists in the inventory
        const hair = encoder.encode("\x00"+iteme+"\x00");
        if (findsubarray(inventory, hair) != -1) {
            // It does exist, don't need to do anything
            document.getElementById('confirmadd').innerHTML = "\tItem already exists; nothing to modify";
        }
        else {
            // It does not exist, need to add it
            addSimpleItem(1, iteme);
            // Confirm add
            document.getElementById('confirmadd').innerHTML = "\tAdded " + itemname + " " + typename + " for " + charname;
        }
    }
    else if ((type == "discs" || type == "journals") && iteme != "") {
        const hair = encoder.encode("\x00"+iteme+"\x00");
        if (findsubarray(inventory, hair) != -1) {
            // It does exist, don't need to do anything
            document.getElementById('confirmadd').innerHTML = "\tItem already exists; nothing to modify";
        }
        else {
            // It does not exist, need to add it
            addSimpleItem(1, iteme);
            // Confirm add
            document.getElementById('confirmadd').innerHTML = "\tAdded " + itemname + " " + typename;
        }
    }
    else if (type == "weapons" && iteme != "" && chare != "" && levelin >= 1 && levelin <= 33) {
        const hair = encoder.encode("\x00"+iteme+"\x00");
        // Inventory
        if (findsubarray(inventory, hair) != -1) {
            // It does exist, don't need to add it
        }
        else {
            // It does not exist, need to add it to inventory
            addSimpleItem(1, iteme);
        }
        // Weapon progressions        
        if (findsubarray(levels, encoder.encode("\x00"+iteme+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00")) != -1) {
            const weapon = encoder.encode("\x00"+iteme+"\x00");
            const weaponl = encoder.encode("\x00"+iteme+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            const weaponloc = findsubarray(levels, weaponl);
            const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
            // It does exist and at the level, don't need to modify it
            if (weaponinfo[weaponinfo.length-1] == levelin) {
                document.getElementById('confirmadd').innerHTML = "\tItem already exists and at this level; nothing to modify";
            }
            else {
                // It does exist but not at the level
                addLevelItem(levelin, iteme);
                document.getElementById('confirmadd').innerHTML = "\tModified " + itemname + " " + typename + " to level " + levelin + " for " + charname;
            }
        }
        else {
            // It does not exist
            addlevelItemNew(levelin, iteme);
            document.getElementById('confirmadd').innerHTML = "\tAdded " + itemname + " " + typename + " to level " + levelin + " for " + charname;
        }
    }
    else if (type == "pictos" && iteme != "" && levelin >= 1 && levelin <= 33) {
        const hair = encoder.encode("\x00"+iteme+"\x00");
        // Inventory
        if (findsubarray(inventory, hair) != -1) {
            // It does exist, don't need to add it
        }
        else {
            // It does not exist, need to add it to inventory
            addSimpleItem(1, iteme);
        }
        // Weapon progressions        
        if (findsubarray(levels, encoder.encode("\x00"+iteme+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00")) != -1) {
            const weapon = encoder.encode("\x00"+iteme+"\x00");
            const weaponl = encoder.encode("\x00"+iteme+"\x00\x30\x00\x00\x00\x43\x75\x72\x72\x65\x6E\x74\x4C\x65\x76\x65\x6C\x5F\x36\x5F\x32\x32\x37\x41\x30\x30\x36\x34\x34\x44\x30\x33\x35\x42\x44\x44\x35\x39\x35\x42\x32\x44\x38\x36\x43\x38\x34\x35\x35\x42\x37\x31\x00\x0C\x00\x00\x00\x49\x6E\x74\x50\x72\x6F\x70\x65\x72\x74\x79\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            const weaponloc = findsubarray(levels, weaponl);
            const weaponinfo = levels.subarray(weaponloc,weaponloc+weaponl.length + 1)
            // It does exist and at the level, don't need to modify it
            if (weaponinfo[weaponinfo.length-1] == levelin) {
                document.getElementById('confirmadd').innerHTML = "\tItem already exists and at this level; nothing to modify";
            }
            else {
                // It does exist but not at the level
                addLevelItem(levelin, iteme);
                document.getElementById('confirmadd').innerHTML = "\tModified " + itemname + " " + typename + " to level " + levelin;
            }
        }
        else {
            // It does not exist
            addlevelItemNew(levelin, iteme);
            document.getElementById('confirmadd').innerHTML = "\tAdded " + itemname + " " + typename + " to level " + levelin;
        }
    }
    else if (type == "upgrade" && iteme != "" && amountin >= 1 && amountin <= 4294967294) {
        const hair = encoder.encode("\x00"+iteme+"\x00");
        if (iteme == "Gold") {
            const view = new DataView(filecontents.buffer);
            const goldlen = encoder.encode("\x05\x00\x00\x00Gold\x00\x0C\x00\x00\x00IntProperty\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00");
            const inventorystart = findsubarray(filecontents, goldlen);
            view.setUint32(inventorystart+goldlen.length, amountin, true);
            document.getElementById('confirmadd').innerHTML = "\tAdded " + amountin + " of " + itemname;
        }
        else if (findsubarray(inventory, hair) != -1) {
            // It does exist, change amount
            addAmount(amountin, iteme);
            document.getElementById('confirmadd').innerHTML = "\tAdded " + amountin + " of " + itemname;
        }
        else {
            // It does not exist, need to add it
            addSimpleItem(amountin, iteme);
            // Confirm add
            document.getElementById('confirmadd').innerHTML = "\tAdded " + amountin + " of " + itemname;
        }
    }
    else {
        document.getElementById('confirmadd').innerHTML = "\tInvalid selection, please make sure all options with a dropdown have been filled out";
    }
    // Making sure the inventory is updated
    const bytearray = new Uint8Array(filecontents);
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
});

document.getElementById('exportsave').addEventListener('click', function(event) {
    if (filecontents != "") {
        var a = document.createElement("a");
        a.setAttribute("href", window.URL.createObjectURL(new Blob([filecontents], {type: "octet/stream"})));
        let exportname = "modifiedsave.";
        a.setAttribute('download', exportname + "sav")
        a.setAttribute('style', `position: fixed; opacity: 0; left: 0; top: 0;`)
        document.body.append(a)
        a.click()
        document.body.removeChild(a)
    };
});