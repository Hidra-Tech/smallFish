from app import (
    app,
    socketio,
    crypto_balance,
    token_balance,
    web3_bsc,
    web3_infura,
    token_metadata,
    crypto_metadata,
    db,
)
from flask import render_template, url_for, request, abort, redirect, flash, session
import stripe
import os
from flask_socketio import SocketIO, send, emit
from pycoingecko import CoinGeckoAPI
from traceback import print_exc
from app.forms import LoginForm
from flask_login import current_user, login_user, logout_user
from app.models import User
from flask_login import login_required
from werkzeug.urls import url_parse
from app.forms import RegistrationForm
from datetime import datetime
import sqlite3
import pandas as pd
from collections import defaultdict

stripe.api_key = app.config["STRIPE_SECRET_KEY"]
webhook_secret = app.config["STRIPE_WEBHOOK_SECRET"]

products = {
    "small_fish_apps": {
        "name": "small_fish_apps",
        "price": 500,
    },
}

cg = CoinGeckoAPI()


@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = LoginForm()
    if form.validate_on_submit():
        connection = sqlite3.connect("database/app.db")
        df = pd.read_sql_query(
            """
        SELECT *
        FROM user
        WHERE username='{}'
        """.format(
                form.username.data
            ),
            connection,
        )
        if df.shape[0] == 0:
            flash("Invalid username")
            return redirect(url_for("login"))
        else:
            user_info = df.to_dict("records")[0]
            user = User.query.filter_by(username=user_info["username"]).first()
            if not user.check_password(form.password.data):
                flash("Invalid password")
                return redirect(url_for("login"))
            elif user_info["active"] == False:
                flash(
                    "This user is registered in a free account. To use the paid apps, please sign up again and confirm the payment."
                )
                cursor = connection.cursor()
                cursor.execute(
                    """
                    DELETE FROM user
                    WHERE username = '{}'
                    """.format(
                        user_info["username"]
                    )
                )
                connection.commit()
                connection.close()
                return redirect(url_for("login"))
            else:
                login_user(user, remember=form.remember_me.data)
                next_page = request.args.get("next")
                if not next_page or url_parse(next_page).netloc != "":
                    next_page = url_for("index")
                connection.close()
                return redirect(next_page)
    return render_template("login.html", title="Sign In", form=form)


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data,
            # active=False,
            subscribed_at=datetime.utcnow(),
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        session["user_email"] = user.email

        return redirect(url_for("order", product_id="small_fish_apps"))
    else:
        print("not ok")
    return render_template(
        "register.html", title="Register", form=form, product_id="small_fish_apps"
    )


@app.route("/checkWallet")
@login_required
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
    connection = sqlite3.connect("database/app.db")
    df = pd.read_sql_query(
        """
        SELECT *
        FROM user
        WHERE active=true
        ORDER BY subscribed_at DESC
        """,
        connection,
    )
    user_info = df.to_dict("records")[0]
    print(user_info)
    connection.close()
    user = User.query.filter_by(username=user_info["username"]).first()
    login_user(user)
    return render_template("success.html")


@app.route("/order/cancel")
def cancel():
    return render_template("cancel.html")


@app.route("/order/<product_id>", methods=['GET', 'POST'])
def order(product_id):
    if product_id not in products:
        abort(404)

    checkout_session = stripe.checkout.Session.create(
        line_items=[
            {
                "price_data": {
                    "product_data": {
                        "name": products[product_id]["name"],
                    },
                    "unit_amount": products[product_id]["price"],
                    "currency": "usd",
                    "recurring": {"interval": "month"},
                },
                "quantity": 1,
            },
        ],
        payment_method_types=["card"],
        mode="subscription",
        success_url=request.host_url + "order/success",
        cancel_url=request.host_url + "order/cancel",
    )

    stripe_id = checkout_session.stripe_id

    connection = sqlite3.connect("database/app.db")
    cursor = connection.cursor()
    cursor.execute(
        """
        UPDATE user 
        SET stripe_id = '{}'
        WHERE email = '{}'
        """.format(
            stripe_id, session["user_email"]
        )
    )
    connection.commit()
    connection.close()

    return redirect(checkout_session.url)


@app.route("/event", methods=["POST"])
def new_event():
    event = None
    payload = request.data
    signature = request.headers["STRIPE_SIGNATURE"]

    try:
        event = stripe.Webhook.construct_event(payload, signature, webhook_secret)
    except Exception as e:
        # the payload could not be verified
        abort(400)

    subscription_dict_items = event["data"]["object"].items()
    subscription_default_dict = defaultdict(list)
    for (k, v) in subscription_dict_items:
        subscription_default_dict[k].append(v)

    subscription_dict = dict(subscription_default_dict)
    subscription_id = subscription_dict["subscription"][0]

    stripe_id = event["data"]["object"].stripe_id

    if event["type"] == "checkout.session.completed":
        connection = sqlite3.connect("database/app.db")
        cursor = connection.cursor()
        cursor.execute(
            """
            UPDATE user 
            SET active = true, subscription_id = '{}'
            WHERE stripe_id = '{}'
            """.format(
                subscription_id, stripe_id
            )
        )
        connection.commit()
        connection.close()
    else:
        connection = sqlite3.connect("database/app.db")
        cursor = connection.cursor()
        cursor.execute(
            """
            UPDATE user 
            SET active = false, subscription_id = '{}'
            WHERE stripe_id = '{}'
            """.format(
                subscription_id, stripe_id
            )
        )
        connection.commit()
        connection.close()

    return {"success": True}


@login_required
@app.route("/subscription", methods=["POST", "GET"])
def subscription():
    user = current_user

    return render_template("subscription.html", user=user)


@app.route("/cancellationConfirmed", methods=["POST", "GET"])
def cancellationConfirmed():
    if request.method == "POST":
        if request.form["cancel_button"] == "Cancel Subscription":
            user = User.query.filter_by(username=current_user.username).first()
            stripe.Subscription.delete(user.subscription_id)
            connection = sqlite3.connect("database/app.db")
            cursor = connection.cursor()
            cursor.execute(
                """
                UPDATE user 
                SET active = false, canceled_at = datetime('now')
                WHERE subscription_id = '{}'
                """.format(
                    user.subscription_id
                )
            )
            connection.commit()
            connection.close()
            logout_user()

    return render_template("cancellationConfirmed.html")


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
