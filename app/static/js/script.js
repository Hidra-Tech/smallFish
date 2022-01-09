"use strict";

const socket = io();

socket.on("computation", (serverData) => {
  const addressField = document.getElementById("address");
  const walletChart = document
    .getElementById("crypto-balance")
    .getContext("2d");

  const walletResults = new Chart(walletChart, {
    type: "bar",
    data: {
      labels: ["BNB", "ETH"],
      datasets: [
        {
          label: "Balance",
          data: [serverData.bnb_balance, serverData.eth_balance],
          backgroundColor: ["rgb(255,255,0, 0.5)", "rgb(88,88,88)"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Balance of ${addressField.value}`,
        fontSize: 24,
      },
    },
  });
  addressField.value = "";
});

document.getElementById("form").onsubmit = (ev) => {
  ev.preventDefault();
  const currencyField = document.querySelector(".currency");
  const addressField = document.getElementById("address");
  const clientData = {
    address: addressField.value,
    currency: currencyField.value,
  };
  socket.emit("form", clientData);
};
