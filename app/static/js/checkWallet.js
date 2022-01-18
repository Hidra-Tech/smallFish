"use strict";

import "./countUp.js";
import "./makeChart.js";
import "./searchBox.js";
import "./usefulFunctions.js";

// ELEMENTS
const socket = io();
const mainContainer = document.querySelector(".main-container");
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

  const firstSection = (coinKind, chartType, sectionTitle) => {
    let coinData = serverData[coinKind];
    const coinChart = document
      .getElementById("crypto-balance")
      .getContext("2d");
    // remove "queryType" property
    coinData = removePropFromObject(coinData, "queryType");
    // shuffle colors: each query a new color scheme
    shuffleArray(backgroundColors);
    makeChart(coinChart, coinData, chartType, backgroundColors);
    writeSection({
      id: "money-balance",
      section: "one",
      sectionTitle: sectionTitle,
      leftId: "balance-currency",
      rightId: "balance-crypto",
      currency: currencyField.value,
      coinKind: coinKind,
    });
    const amount_crypto = sumNumberValues(coinData);
    // https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array
    const selectedColor =
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    countUp({
      amount: amount_crypto,
      id: "money-balance",
      color: selectedColor,
    });
  };

  // const cryptoSection = () => {
  //   // set values for first section
  //   let cryptoData = serverData["crypto"];
  //   const cryptoChart = document
  //     .getElementById("crypto-balance")
  //     .getContext("2d");
  //   // remove "queryType" property
  //   cryptoData = removePropFromObject(cryptoData, "queryType");
  //   makeChart(cryptoChart, cryptoData, "bar", backgroundColors);
  //   writeSection({
  //     id: "money-balance",
  //     section: "one",
  //     sectionTitle: "crypto balance",
  //     leftId: "balance-currency",
  //     rightId: "balance-crypto",
  //     coinKind: currencyField.value,
  //   });
  //   const amount_crypto = sumNumberValues(cryptoData);
  //   countUp({ amount: amount_crypto, id: "money-balance", color: "#5468ff" });
  // };

  // const tokenSection = () => {
  //   // set values for second section
  //   let tokenData = serverData["token"];
  //   const tokenChart = document.getElementById("chart-token").getContext("2d");
  //   // remove "queryType" property
  //   tokenData = removePropFromObject(tokenData, "queryType");
  //   makeChart(tokenChart, tokenData, "doughnut", backgroundColors);
  //   writeSection({
  //     id: "token-balance",
  //     section: "two",
  //     sectionTitle: "token balance",
  //     leftId: "balance-currency",
  //     rightId: "balance-crypto",
  //     coinKind: currencyField.value,
  //   });
  //   const amount_token = sumNumberValues(tokenData);
  //   countUp({ amount: amount_token, id: "token-balance", color: "#93bf85" });
  // };
  if (queryType === "crypto") {
    firstSection("crypto", "bar", "crypto balance");
  } else if (queryType === "token") {
    firstSection("token", "doughnut", "token balance");
  } else if (queryType === "full-report") {
    cryptoSection();
    tokenSection();
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
  console.log(queryType);
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
  `;

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const close = document.createElement("button");
    close.classList.add("close");
    close.innerHTML = "&times;";
    const finishButton = document.createElement("button");
    finishButton.classList.add("button-app");

    mainContainer.append(searchBoxModal);
    searchBoxModal.append(close);
    searchBoxModal.append(finishButton);
    mainContainer.append(overlay);
    const closeModal = () => {
      searchBoxModal.remove();
      overlay.remove();
    };

    overlay.addEventListener("click", closeModal);

    document.querySelector(".close").addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
      }
    });
    searchBox();
    finishButton.addEventListener("click", () => {
      const currencyField = document.querySelector(".currency");
      const addressField = document.getElementById("address");
      const clientData = {
        address: addressField.value,
        currency: currencyField.value,
        queryType: queryType,
        gameTokensSelected: [...document.querySelectorAll(".tokens")],
      };
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
