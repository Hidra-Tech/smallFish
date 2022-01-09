from app import app, socketio
from flask import render_template, url_for, request
from flask_socketio import SocketIO, send, emit
from web3 import Web3
import json
from pycoingecko import CoinGeckoAPI
from traceback import print_exc

cg = CoinGeckoAPI()

bsc = "https://bsc-dataseed.binance.org/"
infura_url = 'https://mainnet.infura.io/v3/11ec2a0eff254af4a2017eae87b60f5d'
web3_bsc = Web3(Web3.HTTPProvider(bsc))
web3_infura = Web3(Web3.HTTPProvider(infura_url))

@app.route('/')
@app.route('/index')
def checkWallet():
    return render_template('index.html')

def crypto_balance(address:str, currency:str):
    # BNB balance
    try:
        bnb = web3_bsc.eth.getBalance(address.strip())
        qtd_bnb = float(web3_bsc.fromWei(bnb, 'ether').to_eng_string())
        price_bnb = cg.get_price(ids='binancecoin', vs_currencies=currency)['binancecoin'][currency]
        bnb_balance = qtd_bnb*price_bnb
    except Exception as e:
        print("The following error occurred:\n")
        print(e.__class__.__name__)
        print_exc()
        return {}

    # ethereum balance
    try:
        eth = web3_infura.eth.getBalance(address.strip())
        qtd_ether = float(web3_infura.fromWei(eth, 'ether').to_eng_string())
        price_eth = cg.get_price(ids='ethereum', vs_currencies=currency)['ethereum'][currency]
        eth_balance = qtd_ether*price_eth
    except Exception as e:
        print("The following error occurred:\n")
        print(e.__class__.__name__)
        print_exc()
        return {}
    
    response = {'bnb_balance':round(bnb_balance, 2), 'eth_balance':round(eth_balance,2)}

    return response

@socketio.on('form')
def handle_form(data):
    response = crypto_balance(data['address'], data['currency'].lower())
    if len(response)!=0:
        emit('computation',response)
    else:
        emit('errorCrypto')
    


