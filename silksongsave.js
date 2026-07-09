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

// This gets the discs, journals, outfits, and hairstyles
let hairfilelist = ["silksongsave/bluetools.json", "silksongsave/redtools.json", 
  "silksongsave/yellowtools.json", "silksongsave/ancestralarts.json",
  "silksongsave/bellways.json", "silksongsave/ventricas.json",
  "silksongsave/silkskills.json", "silksongsave/silkhearts.json",
  "silksongsave/miscabilities.json", "silksongsave/crests.json",
  "silksongsave/fleas.json", "silksongsave/maskshards.json",
  "silksongsave/spoolfragments.json", "silksongsave/maps.json",
  "silksongsave/craftingkit.json", "silksongsave/toolpouch.json",
  "silksongsave/needle.json", "silksongsave/bellhome.json",
  "silksongsave/keys.json", "silksongsave/mementos.json",
  "silksongsave/materium.json", "silksongsave/relics.json",
  "silksongsave/miscitems.json"
];
let hairhtmllist = ['bluetools', 'redtools', 'yellowtools', 'ancestralarts',
  "bellways", "ventricas", "silkskills", "silkhearts", "miscabilities",
  "crests", "fleas", "maskshards", "spoolfragments", "maps", "craftingkit",
  "toolpouch", "needle", "bellhome", "keys", "mementos", "materium", "relics",
  "miscitems"
];
let hairamountlist = [23, 21, 11, 6, 12, 6, 6, 3, 4, 11, 30, 20, 18, 38, 4, 4, 7, 8, 11, 7,
  43, 21, 35
];
function hairloader(filename, htmlname, amountlist, decryptedstr) {
    fetch(filename)
    .then(response => {return response.json();})
    .then(options => {
        const outputs = document.getElementById(htmlname);
        outputs.innerHTML = "";
        let htmlContent = '<tr><th>Name</th><th>Found</th><th>Wiki</th></tr>';
        let curamount = 0;
        options.forEach(item => {
            if (findsubarray(decryptedstr, item.name) != -1) {
              if (item.hasOwnProperty("min") && item.hasOwnProperty("altname")) {
                ministart = findsubarray(decryptedstr, item.name);
                ministring = decryptedstr.slice(ministart+23, ministart+24);
                if (ministring >= item.min || findsubarray(decryptedstr, item.altname) != -1) {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                  curamount += 1;
                }
                else {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                }
              }
              else if (item.hasOwnProperty("endname")) {
                ministart = findsubarray(decryptedstr, item.name);
                ministring = decryptedstr.slice(ministart, ministart+150);
                if (findsubarray(ministring, item.endname)) {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                  curamount += 1;
                }
                else {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                }
              }
              else if (item.hasOwnProperty("min")) {
                ministart = findsubarray(decryptedstr, item.name);
                ministring = decryptedstr.slice(ministart, ministart+30);
                num = ministring.match(/(\d+)/);
                if (num[0] >= item.min) {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                  curamount += 1;
                }
                else {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                }
              }
              else if (item.hasOwnProperty("altname")) {
                if (findsubarray(decryptedstr, item.altname) != -1 || findsubarray(decryptedstr, item.name) != -1) {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                  curamount += 1;
                }
                else {
                  htmlContent += "<tr><td>" + item.ingamename + "</td><td>❌</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                }
              }
              else {
                htmlContent += "<tr><td>" + item.ingamename + "</td><td>✅</td><td><a href=\"" + item.link + "\">Link</a></td></tr>";
                curamount += 1;
              }
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

let decryptedjson = "";
let filenamedat = "";
let filenamejson = "";

document.getElementById('savefile').addEventListener('input', function(event) {
  const file = event.target.files[0];
  filenamedat = file.name;
  filenamejson = "";
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      // As per other Silksong and Hollow Knight save parsers, there is a predefined header and ending byte
      // Source: https://github.com/bloodorca/hollow/blob/master/src/functions.js
      // Source: https://github.com/tureptor/silksong-save-analyzer/blob/main/src/main.js
      const noheader = new Uint8Array(content.slice(25, content.byteLength - 1));
      // Must now change to base64 string
      // Source: https://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
      const base64str = new TextDecoder().decode(noheader);
      // Now can decrypt it
      // Source: https://github.com/MartinShift/silksaver/blob/master/src/services/silksongSave.ts
      const cipherparams = CryptoJS.enc.Base64.parse(base64str);
      const key = CryptoJS.enc.Utf8.parse("UKu52ePUBwetZ9wNX88o54dnfKRu0T1l");
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherparams }, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
      const decryptedstr = CryptoJS.enc.Utf8.stringify(decrypted);
      for (var i = 0; i < hairfilelist.length; i++) {
        hairloader(hairfilelist[i], hairhtmllist[i], hairamountlist[i], decryptedstr);
      }
      decryptedjson = JSON.parse(decryptedstr)
    };
    reader.readAsArrayBuffer(file);
  }
});

document.getElementById('savefilejson').addEventListener('input', function(event) {
  const file = event.target.files[0];
  filenamejson = file.name;
  filenamedat = "";
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      let cleanedString = content.replaceAll(": ", ':');
      cleanedString = cleanedString.replaceAll("\n", '')
      cleanedString = cleanedString.replaceAll("    ", '')
      cleanedString = cleanedString.replaceAll("  ", '')
      for (var i = 0; i < hairfilelist.length; i++) {
        hairloader(hairfilelist[i], hairhtmllist[i], hairamountlist[i], cleanedString);
      }
      decryptedjson = JSON.parse(content);
    };
    reader.readAsText(file);
  }
});

document.getElementById('exportjson').addEventListener('click', function(event) {
  if (decryptedjson != "") {
    // Source: https://github.com/bloodorca/hollow/blob/master/src/functions.js
    var a = document.createElement("a")
    a.setAttribute("href", window.URL.createObjectURL(new Blob([JSON.stringify(decryptedjson, null, 2)], {type: "octet/stream"})));
    let exportname = "";
    if (filenamedat != "") {
      exportname = filenamedat.slice(0, -3);
    }
    if (filenamejson != "") {
      exportname = filenamejson.slice(0, -4);
    }
    a.setAttribute('download', exportname + "json")
    a.setAttribute('style', `position: fixed; opacity: 0; left: 0; top: 0;`)
    document.body.append(a)
    a.click()
    document.body.removeChild(a)
  }
});

// Source: https://github.com/MartinShift/silksaver/blob/master/src/services/silksongSave.ts
const CSHARP_HEADER = new Uint8Array([0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0]);
function addHeader(b64Bytes) {
    const lenBytes = [];
    let length = Math.min(0x7FFFFFFF, b64Bytes.length);
    for (let i = 0; i < 4; i++) {
        if (length >> 7 !== 0) {
            lenBytes.push((length & 0x7F) | 0x80);
            length >>= 7;
        } else {
            lenBytes.push(length & 0x7F);
            break;
        }
    }
    const newBytes = new Uint8Array(CSHARP_HEADER.length + lenBytes.length + b64Bytes.length + 1);
    newBytes.set(CSHARP_HEADER);
    newBytes.set(lenBytes, CSHARP_HEADER.length);
    newBytes.set(b64Bytes, CSHARP_HEADER.length + lenBytes.length);
    newBytes[newBytes.length - 1] = 0x0B;
    return newBytes;
}

document.getElementById('exportdat').addEventListener('click', function(event) {
  if (decryptedjson != "") {
    // Source: https://github.com/bloodorca/hollow/blob/master/src/functions.js
    var a = document.createElement("a");

    const decryptedstr = JSON.stringify(decryptedjson);
    const jsonwords = CryptoJS.enc.Utf8.parse(decryptedstr);
    const key = CryptoJS.enc.Utf8.parse("UKu52ePUBwetZ9wNX88o54dnfKRu0T1l");
    const encrypted = CryptoJS.AES.encrypt(jsonwords, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    const base64str = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const base64bytes = new TextEncoder().encode(base64str);

    a.setAttribute("href", window.URL.createObjectURL(new Blob([addHeader(base64bytes)], {type: "octet/stream"})));
    let exportname = "";
    if (filenamedat != "") {
      exportname = filenamedat.slice(0, -3);
    }
    if (filenamejson != "") {
      exportname = filenamejson.slice(0, -4);
    }
    a.setAttribute('download', exportname + "dat")
    a.setAttribute('style', `position: fixed; opacity: 0; left: 0; top: 0;`)
    document.body.append(a)
    a.click()
    document.body.removeChild(a)
  }
});