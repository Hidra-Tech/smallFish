from app import app
from app import sock
from flask import render_template, url_for, request
from web3 import Web3
import json


bsc = "https://bsc-dataseed.binance.org/"
infura_url = 'https://mainnet.infura.io/v3/11ec2a0eff254af4a2017eae87b60f5d'
web3_bsc = Web3(Web3.HTTPProvider(bsc))
web3_infura = Web3(Web3.HTTPProvider(infura_url))

# print(web3.isConnected())
# #read the block number
# print(web3.eth.blockNumber)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

# @app.route('/checkWallet', methods=['GET', 'POST'])
# def checkWallet():
#     if request.method=="POST":
#         address = request.form.get("address")
#         kwargs = {
#             'address': address
#         }
#         result = bnb_balance(address)
#         print(result)
#     else:
#         kwargs={}

#     return render_template('checkWallet.html', **kwargs)

@app.route('/checkWallet')
def checkWallet():
    return render_template('checkWallet.html')

def bnb_balance(address:str, currency:str):
    # BNB balance
    bnb_balance = web3_bsc.eth.getBalance(address.strip())
    bnb_balance_ether = web3_bsc.fromWei(bnb_balance, 'ether')
    # ethereum balance
    eth_balance = web3_infura.eth.getBalance(address.strip())
    eth_balance_ether = web3_infura.fromWei(eth_balance, 'ether')
    
    # usar API coingecko para vetor de price ratio e converter
    response = {''}

@sock.route('/echo')
def echo(sock):
    while True:
        data_receive = json.loads(sock.receive())
        print(data_receive['address'])
        data = bnb_balance(data_receive['address'], data_receive['currency'])
        sock.send(data)

