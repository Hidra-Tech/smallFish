"use strict";

const socket = new WebSocket("ws://" + location.host + "/echo");

socket.addEventListener("message", (ev) => {
  const addressField = document.getElementById("address");
  const walletChart = document.getElementById("log").getContext("2d");

  const walletResults = new Chart(walletChart, {
    type: "polarArea",
    data: {
      labels: ["BNB"],
      datasets: [
        {
          label: "Balance",
          data: [ev.data],
          backgroundColor: ["rgb(255,255,0, 0.5)"],
        },
      ],
    },
    options: {
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
  socket.send(JSON.stringify(clientData));
};
