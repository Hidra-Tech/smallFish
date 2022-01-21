from flask import Flask
from config import Config
from flask_socketio import SocketIO
from check_wallet import crypto_balance, token_balance
from glob import glob
from web3 import Web3
import json


app = Flask(__name__)
app.config.from_object(Config)
socketio = SocketIO(app)

bsc = "https://bsc-dataseed.binance.org/"
infura_url = "https://mainnet.infura.io/v3/11ec2a0eff254af4a2017eae87b60f5d"
web3_bsc = Web3(Web3.HTTPProvider(bsc))
web3_infura = Web3(Web3.HTTPProvider(infura_url))


# crypto data
crypto_metadata = {
    "bnb_data": {"name": "BNB", "id": "binancecoin", "web3_provider": web3_bsc},
    "eth_data": {"name": "ETH", "id": "ethereum", "web3_provider": web3_infura},
}

# tokens data
abis = glob("abi/*")

dict_abis = {}
for abi in abis:
    with open(f"{abi}") as json_file:
        keyname = abi.replace("abi_", "").replace(".json", "").split("/")[1]
        dict_abis.update({f"{keyname}": json.load(json_file)})

token_metadata = {
    "cryptocars": {
        "name": "CryptoCars (CCAR)",
        "id": "cryptocars",
        "contract": "0x50332bdca94673f33401776365b66cc4e81ac81d",
        "abi": dict_abis["ccar"],
        "web3_provider": web3_bsc,
    },
    "cryptoguards": {
        "name": "CryptoGuards (CGAR)",
        "id": "cryptoguards",
        "contract": "0x432c7cf1de2b97a013f1130f199ed9d1363215ba",
        "abi": dict_abis["cgar"],
        "web3_provider": web3_bsc,
    },
    "bomber-coin": {
        "name": "Bomber Coin (BCOIN)",
        "id": "bomber-coin",
        "contract": "0x00e1656e45f18ec6747f5a8496fd39b50b38396d",
        "abi": dict_abis["bcoin"],
        "web3_provider": web3_bsc,
    },
    "zodiacs": {
        "name": "Zodiacs (ZDC)",
        "id": "zodiacs",
        "contract": "0x5649e392a1bac3e21672203589adf8f6c99f8db3",
        "abi": dict_abis["zodiacs"],
        "web3_provider": web3_bsc,
    },
    "hero-cat-token": {
        "name": "Hero Cat Token (HCT)",
        "id": "hero-cat-token",
        "contract": "cryptoplanes",
        "abi": dict_abis["hct"],
        "web3_provider": web3_bsc,
    },
    "cryptoplanes": {
        "name": "CryptoPlanes (CPAN)",
        "id": "cryptoplanes",
        "contract": "0x04260673729c5f2b9894a467736f3d85f8d34fc8",
        "abi": dict_abis["cpan"],
        "web3_provider": web3_bsc,
    },
    "axie-infinity": {
        "name": "Axie Infinity (AXS)",
        "id": "axie-infinity",
        "contract": "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
        "abi": dict_abis["axs"],
        "web3_provider": web3_infura,
    },
    "plant-vs-undead-token": {
        "name": "Plant vs Undead Token (PVU)",
        "id": "plant-vs-undead-token",
        "contract": "0x31471e0791fcdbe82fbf4c44943255e923f1b794",
        "abi": dict_abis["pvu"],
        "web3_provider": web3_bsc,
    },
    "cryptomines-eternal": {
        "name": "CryptoMines Eternal (ETERNAL)",
        "id": "cryptomines-eternal",
        "contract": "0xd44fd09d74cd13838f137b590497595d6b3feea4",
        "abi": dict_abis["eternal"],
        "web3_provider": web3_bsc,
    },
}

from app import routes
