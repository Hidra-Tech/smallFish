from flask import Flask
from config import Config
from flask_sock import Sock

app = Flask(__name__)
sock = Sock(app)
app.config.from_object(Config)

from app import routes