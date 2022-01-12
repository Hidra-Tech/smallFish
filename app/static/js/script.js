"use strict";

import "./countUp.js";
import "./makeChart.js";

const socket = io();

const mainContainer = document.querySelector(".main-container");

socket.on("computation", (serverData) => {
  const currencyField = document.querySelector(".currency");
  const walletChart = document
    .getElementById("crypto-balance")
    .getContext("2d");
  makeChart(walletChart, serverData);
  // set new values for fields and properties
  writeSection({
    id : "money-balance",
    section : "one",
    sectionTitle : "crypto balance",
    leftId : "balance-currency",
    rightId : "balance-crypto",
    coinKind : currencyField.value}
  );
  const amount = serverData.BNB + serverData.ETH;
  countUp({amount: amount, id: "money-balance"});
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
