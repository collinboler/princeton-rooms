import {
  Chart,
  registerables,
} from "https://cdn.jsdelivr.net/npm/chart.js@4.4.3/+esm";

// Register the components
Chart.register(...registerables);

// find variable frequencies
function extractFrequency(rooms, category) {
  const frequency = rooms.reduce((acc, curr) => {
    acc[curr[category]] = (acc[curr[category]] || 0) + 1;
    return acc;
  }, {});

  return frequency;
}

// find sqft bin frequencies
function sqftFrequency(rooms, category) {
  const frequency = rooms.reduce((acc, curr) => {
    acc[curr[category]] = (acc[curr[category]] || 0) + 1;
    return acc;
  }, {});

  return frequency;
}

// generate charts
export function stats(rooms) {
  document.getElementById("stats-div").innerHTML =
    `<div class="chart-container"><p class="text-xl font-semibold font-mono text-center">Colleges</p><canvas id="college-chart"></canvas></div>
    <br />
    <br />
    <div class="chart-container"><p class="text-xl font-semibold font-mono text-center">Buildings</p><canvas id="building-chart"></canvas></div>
    <br />
    <br />
    <div class="chart-container"><p class="text-xl font-semibold font-mono text-center">Room Types</p><canvas id="type-chart"></canvas></div>
    <br />
    <br />
    <div class="chart-container"><p class="text-xl font-semibold font-mono text-center">Sq. Ft.</p><canvas id="sqft-cjart"></canvas></div>`;

  const collegeFrequency = extractFrequency(rooms, "college");
  const buildingFrequency = extractFrequency(rooms, "building");
  const typeFrequency = extractFrequency(rooms, "type");

  console.log(collegeFrequency);
  console.log(Object.values(collegeFrequency).reduce((a, b) => a + b, 0));
  console.log(buildingFrequency);
  console.log(Object.values(buildingFrequency).reduce((a, b) => a + b, 0));
  console.log(typeFrequency);
  console.log(Object.values(typeFrequency).reduce((a, b) => a + b, 0));

  const ctxCollege = document.getElementById("college-chart");
  new Chart(ctxCollege, {
    type: "pie",
    data: {
      labels: Object.keys(collegeFrequency),
      datasets: [
        {
          label: "Colleges",
          data: Object.values(collegeFrequency),
        },
      ],
    },
    options: {
      layout: {
        padding: 0,
      },
      plugins: {
        legend: {
          labels: {
            padding: 3,
          },
        },
      },
    },
  });

  const ctxBuilding = document.getElementById("building-chart");
  new Chart(ctxBuilding, {
    type: "pie",
    data: {
      labels: Object.keys(buildingFrequency),
      datasets: [
        {
          label: "Colleges",
          data: Object.values(buildingFrequency),
        },
      ],
    },
    options: {
      layout: {
        padding: 0,
      },
      plugins: {
        legend: {
          labels: {
            padding: 3,
          },
        },
      },
    },
  });

  const ctxType = document.getElementById("type-chart");
  new Chart(ctxType, {
    type: "pie",
    data: {
      labels: Object.keys(typeFrequency),
      datasets: [
        {
          label: "Room Type",
          data: Object.values(typeFrequency),
        },
      ],
    },
    options: {
      layout: {
        padding: 0,
      },
      plugins: {
        legend: {
          labels: {
            padding: 3,
          },
        },
      },
    },
  });
}
