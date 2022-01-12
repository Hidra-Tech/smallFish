from app import app, socketio, crypto_balance, token_balance
from flask import render_template, url_for, request
from flask_socketio import SocketIO, send, emit
from web3 import Web3
import json
from pycoingecko import CoinGeckoAPI
from traceback import print_exc

cg = CoinGeckoAPI()

bsc = "https://bsc-dataseed.binance.org/"
infura_url = "https://mainnet.infura.io/v3/11ec2a0eff254af4a2017eae87b60f5d"
web3_bsc = Web3(Web3.HTTPProvider(bsc))
web3_infura = Web3(Web3.HTTPProvider(infura_url))

with open("abis/abi_ccars.json") as json_file:
    abi_ccars = json.load(json_file)


@app.route("/")
@app.route("/index")
def checkWallet():
    return render_template("index.html")


@socketio.on("form")
def handle_form(data):
    response = {}
    try:
        response["BNB"] = crypto_balance(
            address=data["address"],
            id="binancecoin",
            currency=data["currency"].lower(),
            web3_provider=web3_bsc,
        )
    except:
        pass

    try:
        response["ETH"] = crypto_balance(
            address=data["address"],
            id="ethereum",
            currency=data["currency"].lower(),
            web3_provider=web3_infura,
        )
    except:
        pass

    print(response)

    if len(response) != 0:
        emit("computation", response)
    else:
        emit("errorCrypto")
