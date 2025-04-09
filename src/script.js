import Alpine from "alpinejs";
import {
  dialog,
  fadeBanner,
  clearTableOutput,
  clearStatsOutput,
  removeSpacing,
  showOutput,
} from "./looks.js";
import { parseFile } from "./file-parse.js";
import { stats } from "./chart-gen.js";
import { search } from "./search.js";
import { tablulate } from "./table-gen.js";

window.Alpine = Alpine;

Alpine.start();

// show dialog
dialog();

// global access to rooms
let globalRooms = [];
let filteredRooms = [];

// Filter rooms by their type based on checkbox selections
function filterRoomsByType() {
  const selectedTypes = Array.from(document.querySelectorAll('.room-type-filter:checked'))
    .map(checkbox => checkbox.value);
  
  // If no types are selected, show no rooms
  if (selectedTypes.length === 0) {
    filteredRooms = [];
  } else {
    filteredRooms = globalRooms.filter(room => selectedTypes.includes(room.type));
  }

  clearTableOutput();
  clearStatsOutput();
  tablulate(filteredRooms);
  stats(filteredRooms);
}

// Sort rooms by square footage
function sortBySqft() {
  const button = document.getElementById('sort-by-sqft');
  const isAscending = button.getAttribute('data-order') !== 'desc';
  const upArrow = document.getElementById('up-arrow');
  const downArrow = document.getElementById('down-arrow');
  
  // Toggle sort order
  if (isAscending) {
    button.setAttribute('data-order', 'desc');
    // Highlight down arrow for descending order (largest first)
    upArrow.setAttribute('stroke-opacity', '0.3');
    downArrow.setAttribute('stroke-opacity', '1');
    
    filteredRooms.sort((a, b) => parseInt(b.sqft) - parseInt(a.sqft));
  } else {
    button.setAttribute('data-order', 'asc');
    // Highlight up arrow for ascending order (smallest first)
    upArrow.setAttribute('stroke-opacity', '1');
    downArrow.setAttribute('stroke-opacity', '0.3');
    
    filteredRooms.sort((a, b) => parseInt(a.sqft) - parseInt(b.sqft));
  }
  
  clearTableOutput();
  tablulate(filteredRooms);
}

// run everything when file uploaded
document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    parseFile(event)
      .then((rooms) => {
        console.log(rooms);
        globalRooms = rooms;
        filteredRooms = [...rooms]; // Initialize filtered rooms with all rooms
        fadeBanner();
        removeSpacing();
        tablulate(rooms);
        stats(rooms);
        showOutput();
        
        // Setup event listeners for room type filters after rooms are loaded
        document.querySelectorAll('.room-type-filter').forEach(checkbox => {
          checkbox.addEventListener('change', filterRoomsByType);
        });
        
        // Setup sort by sqft button after rooms are loaded
        const sortButton = document.getElementById('sort-by-sqft');
        const upArrow = document.getElementById('up-arrow');
        const downArrow = document.getElementById('down-arrow');
        
        sortButton.setAttribute('data-order', 'asc');
        // Initialize with ascending order (smallest first)
        upArrow.setAttribute('stroke-opacity', '1');
        downArrow.setAttribute('stroke-opacity', '0.3');
        
        sortButton.addEventListener('click', sortBySqft);
      })
      .catch((error) => {
        console.error(error);
      });
  });

// handle filter search queries on input
document.getElementById("search-query").addEventListener("input", (event) => {
  console.log(event.target.value);
  // clear output
  clearTableOutput();
  clearStatsOutput();

  // show all rooms when empty query
  if (event.target.value === "") {
    filterRoomsByType(); // Apply only type filters when search is empty
  } else {
    const results = search(filteredRooms, event.target.value);
    tablulate(results);
    stats(results);
  }
});

// handle filter search queries on enter
document.getElementById("search-query").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const query = document.getElementById("search-query").value;
    console.log(query);
    // clear output
    clearTableOutput();
    clearStatsOutput();

    // show all rooms when empty query
    if (query === "") {
      filterRoomsByType(); // Apply only type filters when search is empty
    } else {
      const results = search(filteredRooms, query);
      tablulate(results);
      stats(results);
    }
  }
});
