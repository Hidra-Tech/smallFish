const Web3 = require('web3')
const rpcURL = 'https://mainnet.infura.io/v3/11ec2a0eff254af4a2017eae87b60f5d'
const web3 = new Web3(rpcURL)

let tokenAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
let walletAddress = "0xBfA533B12F77ce84db51E0496f28Fe8C89CE1F6C";

// The minimum ABI to get ERC20 Token balance
let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];

let contract = new web3.eth.Contract(minABI,tokenAddress);
async function getBalance() {
    balance = await contract.methods.balanceOf(walletAddress).call();
    return balance;
}

getBalance().then(function (result) {
    console.log(result);
});