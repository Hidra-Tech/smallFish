from app import (
    app,
    socketio,
    crypto_balance,
    token_balance,
    web3_bsc,
    web3_infura,
    token_metadata,
    crypto_metadata,
)
from flask import render_template, url_for, request, abort
import stripe
import os
from flask_socketio import SocketIO, send, emit
from pycoingecko import CoinGeckoAPI
from traceback import print_exc

# stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

products = {
    "all_apps": {
        "name": "Plano completo",
        "price": 500,
        "currency": "usd",
        "per": "month",
    },
}

cg = CoinGeckoAPI()


@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html", products=products, product_id="all_apps")


@app.route("/checkWallet")
def checkWallet():
    return render_template("checkWallet.html")


@socketio.on("form")
def handle_form(data):
    response = {}
    if data["queryType"] == "crypto":
        response = {"crypto": crypto_report(data=data), "query-type": data["queryType"]}
    elif data["queryType"] == "token":
        response = {
            "token": token_report(
                data=data, selected_tokens=data["gameTokensSelected"]
            ),
            "query-type": data["queryType"],
        }
    elif data["queryType"] == "full-report":
        response = {
            "crypto": crypto_report(data=data),
            "token": token_report(
                data=data, selected_tokens=data["gameTokensSelected"]
            ),
            "query-type": data["queryType"],
        }

    if len(response) != 0:
        emit("computation", response)
    else:
        emit("errorCrypto")


@app.route("/order/success")
def success():
    return render_template("success.html")


@app.route("/order/cancel")
def cancel():
    return render_template("cancel.html")


def crypto_report(data: dict):
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


def token_report(data: dict, selected_tokens: list):
    token_dict = {}
    token_metadata_filtered = {
        k: v for k, v in token_metadata.items() if k in selected_tokens
    }
    for token in token_metadata_filtered.values():
        token_dict.update(
            {
                token["name"]: token_balance(
                    address=data["address"],
                    contract=token["contract"],
                    abi=token["abi"],
                    id=token["id"],
                    currency=data["currency"].lower(),
                    web3_provider=token["web3_provider"],
                )
            }
        )
    return token_dict


@app.route("/order/<product_id>", methods=["POST"])
def order(product_id):
    print(product_id)
    if product_id not in products:
        abort(404)

    list_items = [
            {
                "price_data": {
                    "recurring": "month",
                    "currency": "usd",
                    "unit_amount": products[product_id]["price"],
                    "quantity": 1,
                    "product_data": {
                        "name": products[product_id]["name"],
                    },
                },
            },
        ],
    print(list_items)
    checkout_session = stripe.checkout.Session.create(
        line_items=list_items,
        payment_method_types=["card"],
        mode="subscription",
        success_url=request.host_url + "order/success",
        cancel_url=request.host_url + "order/cancel",
    )
    return redirect(checkout_session.url)
