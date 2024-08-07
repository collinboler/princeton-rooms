// set the worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";

function fadeBanner() {
  let banner = document.getElementById("banner");
  if (banner) {
    banner.classList.add("opacity-0");
    setTimeout(function () {
      banner.remove();
    }, 500);
  }
}

function divide() {}
function stats() {}

function search(rooms, query) {
  const options = {
    includeScore: true,
    shouldSort: true,
    keys: ["last_name", "first_name"],
  };

  const fuse = new Fuse(rooms, options);

  console.log(fuse.search(searchPattern));
  return fuse.search(searchPattern);
}

// upload file handler
document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    fadeBanner();

    // get file
    const file = event.target.files[0];
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    // new file reader
    const reader = new FileReader();

    // when file successfully read
    reader.onload = function (event) {
      // store raw binary data of file
      const typedarray = new Uint8Array(event.target.result);

      // get pdf from raw binary data
      pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
        // clear output
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = "";

        // initializes array to hold promises for each page
        const pagesPromises = [];

        // extract room + room infos
        const rooms = [];
        let roomsInfoList = [];

        // don't remove if
        // not whitespace and not any of following:
        // 'College'
        // 'Building'
        // 'Room'
        // 'Type'
        // 'Sq. Ft.'
        // 'Updated'
        function noRemove(item) {
          return (
            !/^\s*$/.test(item.str) &&
            item.str !== "College" &&
            item.str !== "Building" &&
            item.str !== "Room" &&
            item.str !== "Type" &&
            item.str !== "Sq. Ft." &&
            !item.str.includes("Updated") &&
            item.str !== "Dorm" &&
            item.str !== "Sq Foot" &&
            !item.str.includes("you")
          );
        }

        // iterate through each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          // keep track of promises for each page (when each page gets retrieved)
          pagesPromises.push(
            pdf.getPage(pageNum).then(function (page) {
              // get text content of each page
              return page.getTextContent().then(function (textContent) {
                // extract relevant room info
                const roomsInPage = textContent.items
                  .filter(noRemove)
                  .map((item) => item.str)
                  .filter((item) => item !== "");

                // organize room info
                let room = {};
                for (let i = 0; i < roomsInPage.length; i++) {
                  if (i % 5 === 0) {
                    room = {};
                    rooms.push(room);
                    room["college"] = roomsInPage[i];
                  } else if (i % 5 === 1) {
                    room["building"] = roomsInPage[i];
                  } else if (i % 5 === 2) {
                    room["room"] = roomsInPage[i];
                  } else if (i % 5 === 3) {
                    room["type"] = roomsInPage[i];
                  } else {
                    room["sqft"] = roomsInPage[i];
                  }
                }
                roomsInfoList = roomsInfoList.concat(roomsInPage);
              });
            }),
          );
        }

        // display room info as table
        function tablulate(rooms) {
          let table = document.getElementById("output");
          let html = `
          <div class="overflow-x-auto">
            <table class="table table-lg">
              <thead>
                <tr>
                  <th>College</th>
                  <th>Building</th>
                  <th>Room #</th>
                  <th>Type</th>
                  <th>Sq.Ft.</th>
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
        }

        // when all pages processed
        Promise.all(pagesPromises).then(function () {
          console.log("All pages processed");
          console.log(rooms);
          tablulate(rooms);
          //stats(rooms);
        });
      });
    };

    // read file to trigger load even when read complete
    reader.readAsArrayBuffer(file);
  });
