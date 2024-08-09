import Alpine from "https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/+esm";
import { parseFile } from "./file-parse.js";
import { stats } from "./chart-gen.js";
import { search } from "./search.js";

window.Alpine = Alpine;

Alpine.start();

// show dialog
dialog();

// global access to rooms
let globalRooms = [];

// run everything when file uploaded
document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    parseFile(event)
      .then((rooms) => {
        console.log(rooms);
        globalRooms = rooms;
        fadeBanner();
        removeSpacing();
        tablulate(rooms);
        stats(rooms);
        showOutput();
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
    tablulate(globalRooms);
    stats(globalRooms);
  } else {
    const results = search(globalRooms, event.target.value);
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
      tablulate(globalRooms);
      stats(globalRooms);
    } else {
      const results = search(globalRooms, query);
      tablulate(results);
      stats(results);
    }
  }
});
