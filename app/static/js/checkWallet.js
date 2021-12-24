"use strict";

// cannot use require in browse, must be node js
// const Web3 = require("web3");
// const rpcURL = "https://mainnet.infura.io/v3/11ec2a0eff254af4a2017eae87b60f5d";
// const web3 = new Web3(rpcURL);

let tokenAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";

const checkWallet = () => {
  console.log("Hi, motherfucker");
  let walletAddress = document.querySelector(".wallet").value;
  console.log(walletAddress);
};

document.querySelector(".check").addEventListener("click", checkWallet);
