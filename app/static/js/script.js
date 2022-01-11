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
  // set new values for fiels and properties
  // addressField.value = "";
  const sectionOneTitle = "Crypto Balance".toUpperCase();
  document.querySelector("#money-balance").style.opacity = 1;
  document.querySelector(
    ".section-one"
  ).innerHTML = `<h2>${sectionOneTitle}</h2>`;
  document.querySelector(
    ".balance-currency"
  ).innerHTML = `<h2>Balance ${currencyField.value.toUpperCase()}</h2>`;
  document.querySelector(".balance-crypto ").innerHTML =
    "<h2>Balance by Cryptocurrency</h2>";
  const amount = serverData.BNB + serverData.ETH;
  countUp(amount);
});

socket.on("errorCrypto", () => {
  // console.log(error.errorMessage);
  // Creating and inserting elements
  const message = document.createElement("div");
  message.classList.add("error-message");
  message.classList.add("modal");
  // message.textContent = 'We use cookied for improved functionality and analytics.';
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
