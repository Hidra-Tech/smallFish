from flask import Flask
from config import Config
from flask_socketio import SocketIO
from check_wallet import crypto_balance, token_balance

app = Flask(__name__)
app.config.from_object(Config)
socketio = SocketIO(app)

from app import routes