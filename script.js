import { parseFile } from "./file-parse.js";

// show dialog
dialog();

// run everything when file uploaded
document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    parseFile(event)
      .then((rooms) => {
        console.log(rooms);
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

// handle
/*document.getElementById("").addEventListener("input", (event) => {
  // show all rooms when empty query
  if (event.target.value === "") {
    tablulate(rooms);
  } else {
  }
});*/
