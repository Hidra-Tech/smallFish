from app import app, socketio, crypto_balance, token_balance, web3_bsc, web3_infura, token_metadata, crypto_metadata
from flask import render_template, url_for, request
from flask_socketio import SocketIO, send, emit
from pycoingecko import CoinGeckoAPI
from traceback import print_exc

cg = CoinGeckoAPI()

@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/checkWallet")
def checkWallet():
    return render_template("checkWallet.html")

@socketio.on("form")
def handle_form(data):
    response = {}
    if data['queryType']=='crypto':
        response = {'crypto': crypto_report(data=data), 'query-type': data['queryType']}  
    elif data['queryType']=='token':
        response = {'token': token_report(data=data), 'query-type': data['queryType']}
    elif data['queryType']=='full-report':
        response = {'crypto':crypto_report(data=data), 'token':token_report(data=data), 'query-type': data['queryType']}

    if len(response) != 0:
        emit("computation", response)
    else:
        emit("errorCrypto")

def crypto_report(data:dict):
    crypto_dict = {}
    for crypto in crypto_metadata.values():
        crypto_dict.update(
            {
                crypto["name"]: crypto_balance(
                    address=data["address"],
                    id=crypto["id"],
                    currency=data["currency"].lower(),
                    web3_provider=crypto["web3_provider"],
                )
            }
        )
    return crypto_dict

def token_report(data:dict):
    token_dict = {}
    for token in token_metadata.values():
        token_dict.update(
            {
                token["name"]: token_balance(
                    address=data["address"],
                    contract=token['contract'],
                    abi=token['abi'],
                    id=token["id"],
                    currency=data["currency"].lower(),
                    web3_provider=token["web3_provider"],
                )
            }
        )
    return token_dict
