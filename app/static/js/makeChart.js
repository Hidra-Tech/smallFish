const makeChart = (walletChart, serverData, type, color) => {
  const coins = Object.keys(serverData).filter(
    (x) => serverData[x].length != 0
  );
  backgroundColors = color.slice(0, coins.length);
  const dataArray = coins.map((x) => serverData[x].toFixed(2));
  const walletResults = new Chart(walletChart, {
    type: type,
    data: {
      labels: coins,
      datasets: [
        {
          label: "Balance",
          data: dataArray,
          backgroundColor: backgroundColors,
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

const writeSection = ({
  id,
  section,
  sectionTitle,
  leftId,
  rightId,
  coinKind,
}) => {
  document.getElementById(id).style.opacity = 1;
  document.querySelector(
    `.${section}`
  ).innerHTML = `<h2>${sectionTitle.toUpperCase()}</h2>`;
  document.querySelector(
    `.${leftId}`
  ).innerHTML = `<h2>Balance ${coinKind.toUpperCase()}</h2>`;
  document.querySelector(
    `.${rightId}`
  ).innerHTML = `<h2>Balance by ${coinKind}</h2>`;
};
