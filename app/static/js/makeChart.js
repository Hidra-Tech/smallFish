const makeChart = (walletChart, serverData, type, color, chartTitle) => {
  const coins = Object.keys(serverData).filter(
    (x) => serverData[x].length != 0
  );
  backgroundColors = color.slice(0, coins.length);
  const dataArray = coins.map((x) => serverData[x].toFixed(2));
  const datalabels = {
    anchor: "end",
    align: "top",
    offset: 10,
    font: {
      size: 20,
    },
  };
  const datasets = [];
  const ncoins = dataArray.length;

  for (let i = 0; i < ncoins; i++) {
    datasets.push({
      label: coins[i],
      backgroundColor: backgroundColors[i],
      data: Array(dataArray[i]),
      datalabels: datalabels,
    });
  }
  // create a chart object for each type
  if (type === "bar") {
    const walletResults = new Chart(walletChart, {
      type: "bar",
      data: {
        labels: [""],
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 24,
            },
            position: "top",
          },
          legend: {
            display: true,
            position: "right",
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  } else if (type === "doughnut") {
    const walletResults = new Chart(walletChart, {
      type: type,
      data: {
        labels: coins,
        datasets: [
          {
            label: "crypto" + type,
            data: dataArray,
            backgroundColor: backgroundColors,
            datalabels: {
              anchor: "center",
              // align: "top",
              // offset: 10,
              color: "white",
              font: {
                size: 20,
              },
            },
          },
        ],
      },
      options: {
        // responsive: true,
        // maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 24,
            },
            position: "top",
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
};
