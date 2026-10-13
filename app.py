import os

from flask import Flask, redirect, url_for
from dotenv import load_dotenv

from routes.cliente_routes import cliente_bp
from routes.auth_routes import auth_bp

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'troque-esta-chave-no-env')

app.register_blueprint(auth_bp)
app.register_blueprint(cliente_bp)


@app.route('/')
def index():
    return redirect(url_for('auth.login_page'))


if __name__ == '__main__':
    app.run(debug=True)
