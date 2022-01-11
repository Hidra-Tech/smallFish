const makeChart = (walletChart, serverData) => {
  const coins = Object.keys(serverData);
  console.log(serverData);
  const dataArray = coins.map((x) => serverData[x].toFixed(2));
  console.log(dataArray);
  const walletResults = new Chart(walletChart, {
    type: "bar",
    data: {
      labels: coins,
      datasets: [
        {
          label: "Balance",
          data: dataArray,
          backgroundColor: ["rgb(255,255,0, 0.5)", "rgb(88,88,88)"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Saldo metamask - Crypto",
        fontSize: 24,
      },
    },
  });
};
