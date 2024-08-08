// allow for sorting reverse
let sorted = false;

// remove site banner
function fadeBanner() {
  let banner = document.getElementById("banner");
  if (banner) {
    banner.classList.add("opacity-0");
    setTimeout(function () {
      banner.remove();
    }, 500);
  }
}

// clear output
function clearTableOutput() {
  const table = document.getElementById("table-div");
  table.innerHTML = `<span class="loading loading-infinity loading-lg text-warning"></span>`;
}

// remove space evenly for main justify-evenly
function removeSpacing() {
  document.getElementsByTagName("main")[0].classList.remove("justify-evenly");
}

// show table etc
function showOutput() {
  document.getElementById("output").style.display = "flex";
}

// higher-order function to create a comparison function
function createCompareFunction(category, reverse) {
  return function (a, b) {
    const valueA = a[category];
    const valueB = b[category];

    // try to parse values as numbers
    const numA = parseFloat(valueA);
    const numB = parseFloat(valueB);

    if (!isNaN(numA) && !isNaN(numB)) {
      return reverse ? numB - numA : numA - numB;
    }

    // compare as strings
    return reverse
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  };
}

// sort rooms
function sortTable(rooms, category, sorted) {
  const compareFunction = createCompareFunction(category, sorted);
  rooms.sort(compareFunction);

  // re-render table
  clearTableOutput();
  tablulate(rooms);
}

// display room info as table
function tablulate(rooms) {
  document.getElementById("table-div").innerHTML = `<div id="table"></div>`;

  let table = document.getElementById("table");
  let html = `
  <div class="overflow-x-auto">
    <table class="table table-lg">
      <thead>
        <tr>
          <th id="college-heading">college</th>
          <th id="building-heading">building</th>
          <th id="room-heading">room</th>
          <th id="type-heading">type</th>
          <th id="sqft-heading">sqft</th>
        </tr>
      </thead>
      <tbody>`;
  rooms.forEach((room) => {
    html += `
    <tr class="hover">
      <td>${room.college}</td>
      <td>${room.building}</td>
      <td>${room.room}</td>
      <td>${room.type}</td>
      <td>${room.sqft}</td>
    </tr>`;
  });
  html += `
      </tbody>
    </table>
  </div>`;
  table.innerHTML = html;

  // add sort capability on click
  const tableHeadings = document.getElementsByTagName("th");

  Array.from(tableHeadings).map((item) => {
    item.addEventListener("click", () => {
      sorted = !sorted;
      console.log(sorted);
      sortTable(rooms, item.innerText, sorted);
    });
  });
}
