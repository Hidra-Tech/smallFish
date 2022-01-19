const makeChart = (walletChart, serverData, type, color, chartTitle) => {
  const coins = Object.keys(serverData).filter(
    (x) => serverData[x].length != 0
  );
  backgroundColors = color.slice(0, coins.length);
  const dataArray = coins.map((x) => serverData[x].toFixed(2));
  // create a chart object for each type
  if (type === "bar") {
    const walletResults = new Chart(walletChart, {
      type: "bar",
      data: {
        labels: [""],
        datasets: [
          {
            label: coins[0],
            backgroundColor: backgroundColors[0],
            data: Array(dataArray[0]),
          },
          {
            label: coins[1],
            backgroundColor: backgroundColors[1],
            data: Array(dataArray[1]),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: "right",
        },
        title: {
          display: true,
          text: chartTitle,
          fontSize: 24,
          position: "bottom",
        },
      },
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
          },
        ],
      },
      options: {
        // responsive: true,
        // maintainAspectRatio: false,
        legend: {
          display: true,
          position: "right",
        },
        title: {
          display: true,
          text: chartTitle,
          fontSize: 24,
        },
      },
    });
  }
};
