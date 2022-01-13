"use strict";

import "./countUp.js";
import "./makeChart.js";
import "./usefulFunctions.js";

const socket = io();

const mainContainer = document.querySelector(".main-container");

socket.on("computation", (serverData) => {
  const cryptoData = serverData["crypto"];
  const tokenData = serverData["token"];
  const currencyField = document.querySelector(".currency");
  // set values for first section
  const cryptoChart = document
    .getElementById("crypto-balance")
    .getContext("2d");
  const backgroundColors = [
    "#6b5b95",
    "#feb236",
    "#d64161",
    "#ff7b25",
    "#3e4444",
    "#82b74b",
    "#405d27",
  ];
  makeChart(cryptoChart, cryptoData, "bar", backgroundColors);
  writeSection({
    id: "money-balance",
    section: "one",
    sectionTitle: "crypto balance",
    leftId: "balance-currency",
    rightId: "balance-crypto",
    coinKind: currencyField.value,
  });
  const amount_crypto = sumNumberValues(cryptoData);
  countUp({ amount: amount_crypto, id: "money-balance", color: "#5468ff" });
  // set values for second section
  const tokenChart = document.getElementById("chart-token").getContext("2d");
  makeChart(tokenChart, tokenData, "doughnut", backgroundColors);
  writeSection({
    id: "token-balance",
    section: "two",
    sectionTitle: "token balance",
    leftId: "balance-currency",
    rightId: "balance-crypto",
    coinKind: currencyField.value,
  });
  // const tokenPositive = Object.keys(tokenData).filter((x)=>tokenData.x!='')
  const amount_token = sumNumberValues(tokenData);
  console.log(amount_token);
  countUp({ amount: amount_token, id: "token-balance", color: "#93bf85" });
});

socket.on("errorCrypto", () => {
  // Creating and inserting elements
  const message = document.createElement("div");
  message.classList.add("error-message");
  message.classList.add("modal");
  message.innerHTML =
    "We cannot connect the provided wallet to ethereum or smart chain nodes. Please, check if this wallet is connect to one of these networks. It's also possible that we got a problem with coingecko API. In the later case, wait some minutes and try again later.";
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
