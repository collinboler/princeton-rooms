import { addSortFunction } from "./sort.js";

// display room info as table
export function tablulate(rooms) {
  // Get the filter controls before overwriting them
  const filterControls = document.getElementById("filter-controls");
  
  // Create a div to hold the table if it doesn't exist
  if (!document.getElementById("table-container")) {
    const tableContainer = document.createElement("div");
    tableContainer.id = "table-container";
    document.getElementById("table-div").appendChild(tableContainer);
  }
  
  // Target the table container instead of the whole table-div
  const tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = `<div id="table"></div>`;

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

  addSortFunction(rooms);
}
