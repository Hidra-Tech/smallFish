from pycoingecko import CoinGeckoAPI
from traceback import print_exc

cg = CoinGeckoAPI()

def crypto_balance(address: str, id: str, currency: str, web3_provider: str):
    """
    Returns ETH, BTC and BNB balance of given wallet

    address: metamask address
    id: coingecko coin' id
    currency: BRL|USD
    web3_provider: infura | bsc
    """
    try:
        address = web3_provider.toChecksumAddress(address)
        coin = web3_provider.eth.getBalance(address.strip())
        qtd = float(web3_provider.fromWei(coin, "ether").to_eng_string())
        price = cg.get_price(ids=id, vs_currencies=currency)[id][currency]
        balance = qtd * price
    except Exception as e:
        print("The following error occurred:\n")
        print(e.__class__.__name__)
        print_exc()
        return ""

    return balance


def token_balance(
    address: str, contract: str, abi: str, id: str, currency: str, web3_provider: str
):
    """
    Returns any token balance based on contract and abi
    """
    try:
        token_address = web3.toChecksumAddress(contract)
        wallet_address = address
        token = web3.eth.contract(address=token_address, abi=abi)
        token_balance = token.functions.balanceOf(wallet_address).call()
        qtd = float(web3.fromWei(token_balance, "ether").to_eng_string())
        price = cg.get_price(ids=id, vs_currencies=currency)[id][currency]
        balance = qtd * price
    except Exception as e:
        print("The following error occurred:\n")
        print(e.__class__.__name__)
        print_exc()
        return ""

    return balance
