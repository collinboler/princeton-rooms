import { clearTableOutput } from "./looks.js";
import { tablulate } from "./table-gen.js";

// allow for sorting reverse
let sorted = false;

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

export function addSortFunction(rooms) {
  // add sort capability on click
  const tableHeadings = document.getElementsByTagName("th");

  Array.from(tableHeadings).forEach((item) => {
    item.addEventListener("click", () => {
      sorted = !sorted;
      sortTable(rooms, item.innerText, sorted);
    });
  });
}
