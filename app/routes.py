from app import app, socketio, crypto_balance, token_balance, web3_bsc, web3_infura, token_metadata, crypto_metadata
from flask import render_template, url_for, request
from flask_socketio import SocketIO, send, emit
from pycoingecko import CoinGeckoAPI
from traceback import print_exc

cg = CoinGeckoAPI()

@app.route("/")
@app.route("/index")
def checkWallet():
    return render_template("index.html")


@socketio.on("form")
def handle_form(data):
    # response = {}
    crypto_dict = {}
    token_dict = {}
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

    response = {'crypto':crypto_dict, 'token':token_dict}

    # response = {'crypto':{'BNB':5.37, 'ETH':6.67}}

    print(response)

    if len(response) != 0:
        emit("computation", response)
    else:
        emit("errorCrypto")
