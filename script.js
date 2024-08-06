import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs";

// Set the workerSrc to the appropriate URL
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";

function fadeBanner() {
  let banner = document.getElementById("banner");
  if (banner) {
    banner.classList.add("opacity-0"); // Add class to start the fade-out effect
    setTimeout(function () {
      banner.remove(); // Remove the element after the transition ends
    }, 500); // Adjust the timing to match the transition duration
  }
}

function divide() {}

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

// Upload file handler
document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    fadeBanner();

    const file = event.target.files[0];
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const typedarray = new Uint8Array(event.target.result);

      pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = ""; // Clear previous content

        const pagesPromises = [];

        let roomsInfoList = [];

        const rooms = [];

        function noRemove(item) {
          // if not whitespace and isn't 'College' and isn't 'Building' and isn't 'Room' and isn't 'Type' and isn't 'Sq. Ft.' doesn't have 'Updated' and doesn't have
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

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          pagesPromises.push(
            pdf.getPage(pageNum).then(function (page) {
              return page.getTextContent().then(function (textContent) {
                const pageText = textContent.items
                  .filter(noRemove)
                  .map((item) => item.str)
                  .join("|");
                const pageElement = document.createElement("div");
                pageElement.textContent = pageText;

                const roomsInPage = pageText
                  .split("|")
                  .filter((item) => item !== "");
                //console.log(roomsInPage);

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

                //outputDiv.appendChild(pageElement);
                //outputDiv.appendChild(h);
              });
            }),
          );
        }

        Promise.all(pagesPromises).then(function () {
          console.log("All pages processed");
          roomsInfoList = roomsInfoList;
          //console.log(roomsInfoList);
          console.log(rooms);
          divide();
          tablulate(rooms);
          //stats(rooms);
        });
      });
    };

    reader.readAsArrayBuffer(file);
  });
