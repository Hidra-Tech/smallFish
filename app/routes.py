from app import app
from app import sock
from flask import render_template, url_for, request
from web3 import Web3


bsc = "https://bsc-dataseed.binance.org/"
web3 = Web3(Web3.HTTPProvider(bsc))

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

def bnb_balance(address:str):
    balance = web3.eth.getBalance(address.strip())
    return web3.fromWei(balance, 'ether')

@sock.route('/echo')
def echo(sock):
    while True:
        address = sock.receive()
        data = bnb_balance(address)
        sock.send(data)

