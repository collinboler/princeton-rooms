import { parseFile } from "./file-parse.js";
import { search } from "./search.js";

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

// handle filter search queries
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
