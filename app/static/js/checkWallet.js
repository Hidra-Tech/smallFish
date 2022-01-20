"use strict";

import "./countUp.js";
import "./makeChart.js";
import "./searchBox.js";
import "./usefulFunctions.js";

// ELEMENTS
const socket = io();
const mainContainer = document.querySelector(".main-container");
const gameTokens = [
  {
    name: "CryptoCars (CCAR)",
    id: "cryptocars",
    contract: "0x50332bdca94673f33401776365b66cc4e81ac81d",
  },
  {
    name: "CryptoPlanes (CPAN)",
    id: "cryptoplanes",
    contract: "0x04260673729c5f2b9894a467736f3d85f8d34fc8",
  },
  {
    name: "CryptoGuards (CGAR)",
    id: "cryptoguards",
    contract: "0x432c7cf1de2b97a013f1130f199ed9d1363215ba",
  },
  {
    name: "Zodiacs (ZDC)",
    id: "zodiacs",
    contract: "0x5649e392a1bac3e21672203589adf8f6c99f8db3",
  },
  {
    name: "Bomber Coin (BCOIN)",
    id: "bomber-coin",
    contract: "0x00e1656e45f18ec6747f5a8496fd39b50b38396d",
  },
];
let queryType;

// EVENTS
socket.on("computation", (serverData) => {
  const currencyField = document.querySelector(".currency");
  const backgroundColors = [
    "#feb236",
    "#6b5b95",
    "#d64161",
    "#ff7b25",
    "#3e4444",
    "#82b74b",
    "#405d27",
  ];

  const buildSingleSection = (
    coinKind,
    chartType,
    chartTitle,
    sectionTitle
  ) => {
    const singleSection = document.createElement("div");
    singleSection.classList.add("section");
    singleSection.classList.add("one");
    singleSection.classList.add("modal-result");
    singleSection.textContent = "Hi!";

    singleSection.innerHTML = `
  <div class="section-one-title">
  <h1> ${sectionTitle} </h1>
  </div>
  <div class="result">
    <div class="chart" id="money-balance" data-percent="50"></div>
    <div class="chart-container">
      <canvas id="crypto-balance"> </canvas>
    </div>
  </div>
  `;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const close = document.createElement("button");
    close.classList.add("close");
    close.innerHTML = "&times;";
    mainContainer.append(singleSection);
    singleSection.append(close);
    mainContainer.append(overlay);
    const closeModal = () => {
      singleSection.remove();
      overlay.remove();
    };

    overlay.addEventListener("click", closeModal);

    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    });
    let coinData = serverData[coinKind];
    const coinChart = document
      .getElementById("crypto-balance")
      .getContext("2d");
    // remove "queryType" property
    coinData = removePropFromObject(coinData, "queryType");
    // shuffle colors: each query a new color scheme
    shuffleArray(backgroundColors);
    makeChart(coinChart, coinData, chartType, backgroundColors, chartTitle);
    const amount_crypto = sumNumberValues(coinData);
    // https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array
    const selectedColor =
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    countUp({
      amount: amount_crypto,
      id: "money-balance",
      color: selectedColor,
      currency: currencyField.value,
    });
  };

  const buildDoubleSection = (
    coinKind,
    chartType,
    chartTitle,
    sectionTitle
  ) => {
    const singleSection = document.createElement("div");
    singleSection.classList.add("section");
    singleSection.classList.add("one");
    singleSection.classList.add("modal-result");
    singleSection.textContent = "Hi!";

    singleSection.innerHTML = `
  <div class="section-one-title">
  <h1> ${sectionTitle} </h1>
  </div>
  <div class="result">
    <div class="chart" id="money-balance" data-percent="50"></div>
    <div class="chart-container">
      <canvas id="crypto-balance"> </canvas>
    </div>
  </div>

  <div class="section two"></div>

  <div class="section-two-title">
    <div class="balance-currency"></div>
    <div class="balance-crypto"></div>
  </div>
  <div class="result">
    <div class="chart" id="token-balance" data-percent="50"></div>
    <div class="chart-container">
      <canvas id="chart-token"> </canvas>
    </div>
  </div>
  `;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const close = document.createElement("button");
    close.classList.add("close");
    close.innerHTML = "&times;";
    mainContainer.append(singleSection);
    singleSection.append(close);
    mainContainer.append(overlay);
    const closeModal = () => {
      singleSection.remove();
      overlay.remove();
    };

    overlay.addEventListener("click", closeModal);

    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    });
    let coinData = serverData[coinKind];
    const coinChart = document
      .getElementById("crypto-balance")
      .getContext("2d");
    // remove "queryType" property
    coinData = removePropFromObject(coinData, "queryType");
    // shuffle colors: each query a new color scheme
    shuffleArray(backgroundColors);
    makeChart(coinChart, coinData, chartType, backgroundColors, chartTitle);
    const amount_crypto = sumNumberValues(coinData);
    // https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array
    const selectedColor =
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    countUp({
      amount: amount_crypto,
      id: "money-balance",
      color: selectedColor,
      currency: currencyField.value,
    });
  };

  if (queryType === "crypto") {
    buildSingleSection(
      "crypto",
      "bar",
      "Wallet Balance by Crypto",
      "Crypto Report"
    );
  } else if (queryType === "token") {
    buildSingleSection(
      "token",
      "doughnut",
      "Wallet balance by Game Token",
      "Game Token Report"
    );
  } else if (queryType === "full-report") {
    buildDoubleSection();
  }
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
  queryType = document.querySelector("input[name=query-type]:checked").value;
  ev.preventDefault();
  if (queryType === "token" || queryType === "full-report") {
    const searchBoxModal = document.createElement("div");
    searchBoxModal.classList.add("modal-search-box");
    searchBoxModal.innerHTML = `
  <div>   <h1> Select Tokens </h1>  </div>
  <div class="box-select-token">
    <div class="autocomplete">
      <div class="search-title"><h2>Search</h2></div>
      <input class="token-option" type="text" />
    </div>
    <div class="box-buttons">
      <button class="button-app add">Add</button>
      <button class="button-app remove">Remove</button>
    </div>
    <div class="selected-token">
      <ol class="selected-tokens-list"></ol>
    </div>
  </div>
  <div class="finish-search">
  <button class="button-app finish-button">Finish</button>
  </div>
  `;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const close = document.createElement("button");
    close.classList.add("close");
    close.innerHTML = "&times;";
    mainContainer.append(searchBoxModal);
    searchBoxModal.append(close);
    mainContainer.append(overlay);
    const closeModal = () => {
      searchBoxModal.remove();
      overlay.remove();
    };

    overlay.addEventListener("click", closeModal);

    const finishButton = document.querySelector(".finish-button");
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    });
    searchBox(gameTokens);
    finishButton.addEventListener("click", () => {
      const currencyField = document.querySelector(".currency");
      const addressField = document.getElementById("address");
      let itemsTokens = document
        .querySelector(".selected-tokens-list")
        .getElementsByTagName("li");
      const selectedTokensName = [];

      // using for loop because itemsTokens is an object
      for (const element of itemsTokens) {
        selectedTokensName.push(element.innerText);
      }

      const gameTokensFiltered = gameTokens.filter((x) =>
        selectedTokensName.includes(x.name)
      );
      const selectedTokens = gameTokensFiltered.map((x) => x.id);

      const clientData = {
        address: addressField.value,
        currency: currencyField.value,
        queryType: queryType,
        gameTokensSelected: selectedTokens,
      };
      console.log(clientData.gameTokensSelected);
      closeModal();
      socket.emit("form", clientData);
    });
  } else {
    const currencyField = document.querySelector(".currency");
    const addressField = document.getElementById("address");
    queryType = document.querySelector("input[name=query-type]:checked").value;
    const clientData = {
      address: addressField.value,
      currency: currencyField.value,
      queryType: queryType,
    };
    socket.emit("form", clientData);
  }
};
