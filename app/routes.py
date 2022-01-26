from app import (
    app,
    socketio,
    crypto_balance,
    token_balance,
    web3_bsc,
    web3_infura,
    token_metadata,
    crypto_metadata,
    db
)
from flask import render_template, url_for, request, abort, redirect, flash
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

stripe.api_key = app.config['STRIPE_SECRET_KEY']
webhook_secret = app.config['STRIPE_WEBHOOK_SECRET']

products = {
    "small_fish_apps":{
        "name": "small_fish_apps",
        "price": 500,
    },
}

cg = CoinGeckoAPI()


@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    print(current_user.is_authenticated)
    logout_user()
    print(current_user.is_authenticated)
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    # print(form.username.data)
    # if form.validate_on_submit():
    #     user = User(username=form.username.data, email=form.email.data)
    #     user.set_password(form.password.data)
    #     db.session.add(user)
    #     db.session.commit()
    #     flash('Congratulations, you are now a registered user!')
    #     return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form, product_id="small_fish_apps")


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
    if product_id not in products:
        abort(404)

    global form
    form = RegistrationForm()

    checkout_session = stripe.checkout.Session.create(
        line_items=[
            {
                'price_data': {
                    'product_data': {
                        'name': products[product_id]['name'],
                    },
                    'unit_amount': products[product_id]['price'],
                    'currency': 'usd',
                    'recurring': {
                        'interval':'month'
                    }
                },
                'quantity': 1,
            },
        ],
        payment_method_types=['card'],
        mode='subscription',
        success_url=request.host_url + 'order/success',
        cancel_url=request.host_url + 'order/cancel',
    )
    return redirect(checkout_session.url)

@app.route('/event', methods=['POST'])
def new_event():
    event = None
    payload = request.data
    signature = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, signature, webhook_secret)
    except Exception as e:
        # the payload could not be verified
        abort(400)

    if event['type'] == 'checkout.session.completed':
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        
    return {'success': True}

