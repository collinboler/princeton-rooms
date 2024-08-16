import Chart from "chart.js/auto";

const pieChartOptions = {
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
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};

const barChartOptions = {
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
};

// find variable frequencies
function extractFrequency(rooms, category) {
  const frequency = rooms.reduce((acc, curr) => {
    acc[curr[category]] = (acc[curr[category]] || 0) + 1;
    return acc;
  }, {});

  return frequency;
}

// find sqft bin frequencies
function sqftFrequency(rooms) {
  const sqftArr = rooms.map((room) => parseFloat(room.sqft));

  // create bins
  const minSqft = Math.min(...sqftArr);
  const maxSqft = Math.max(...sqftArr);
  const binWidth = 50;

  const lowerBound = Math.floor(minSqft / binWidth) * binWidth;
  const upperBound = Math.floor(maxSqft / binWidth) * binWidth;

  console.log(
    `min: ${minSqft} - max: ${maxSqft} - lowerBound: ${lowerBound} - upperBound: ${upperBound}`,
  );

  const bins = {};

  for (let i = lowerBound; i <= upperBound; i += binWidth) {
    bins[`${i} - ${i + binWidth - 1}`] = 0;
  }

  sqftArr.forEach((item) => {
    const bin = Math.floor(item / binWidth) * binWidth;
    bins[`${bin} - ${bin + binWidth - 1}`] += 1;
  });

  return bins;
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
    <div class="chart-container"><p class="text-xl font-semibold font-mono text-center">Sq. Ft.</p><canvas id="sqft-chart"></canvas></div>`;

  const collegeFrequency = extractFrequency(rooms, "college");
  const buildingFrequency = extractFrequency(rooms, "building");
  const typeFrequency = extractFrequency(rooms, "type");
  const binFrequency = sqftFrequency(rooms);

  console.log(collegeFrequency);
  console.log(Object.values(collegeFrequency).reduce((a, b) => a + b, 0));
  console.log(buildingFrequency);
  console.log(Object.values(buildingFrequency).reduce((a, b) => a + b, 0));
  console.log(typeFrequency);
  console.log(Object.values(typeFrequency).reduce((a, b) => a + b, 0));
  console.log(binFrequency);
  console.log(Object.values(binFrequency).reduce((a, b) => a + b, 0));

  const chartsInfo = {
    college: ["pie", collegeFrequency, pieChartOptions],
    building: ["pie", buildingFrequency, pieChartOptions],
    type: ["pie", typeFrequency, pieChartOptions],
    sqft: ["bar", binFrequency, barChartOptions],
  };

  const charts = document.getElementsByTagName("canvas");
  Array.from(charts).forEach((ctx) => {
    const chartKey = ctx.id.split("-")[0];
    new Chart(ctx, {
      type: chartsInfo[chartKey][0],
      data: {
        labels: Object.keys(chartsInfo[chartKey][1]),
        datasets: [
          {
            label: "Frequency",
            data: Object.values(chartsInfo[chartKey][1]),
          },
        ],
      },
      options: chartsInfo[chartKey][2],
    });
  });
}
