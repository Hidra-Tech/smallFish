"use strict";

const socket = io();

const mainContainer = document.querySelector(".main-container");

socket.on("computation", (serverData) => {
  const addressField = document.querySelector(".address");
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
  // set new values for fiels and properties
  addressField.value = "";
  document.querySelector("#money-balance").style.opacity = 1;
});

socket.on("errorCrypto", () => {
  // console.log(error.errorMessage);
  // Creating and inserting elements
  const message = document.createElement("div");
  message.classList.add("error-message");
  message.classList.add("modal");
  // message.textContent = 'We use cookied for improved functionality and analytics.';
  message.innerHTML =
    "It looks like we got a problem with coingecko API. Please, wait some minutes and try again later.";
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  const close = document.createElement("button");
  close.classList.add("close");
  close.innerHTML = "&times;";

  mainContainer.append(message);
  message.append(close);
  mainContainer.append(overlay);

  const closeModal = () => {
    message.remove();
    overlay.remove();
  };

  overlay.addEventListener("click", closeModal);

  document.querySelector(".close").addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });
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
