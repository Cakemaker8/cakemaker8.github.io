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

// https://www.w3schools.com/howto/howto_js_filter_table.asp
// W3 Schools for the win
function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("content");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}