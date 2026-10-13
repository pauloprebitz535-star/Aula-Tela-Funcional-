from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for

from controllers import auth_controller

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login')
def login_page():
    return render_template('login.html')


@auth_bp.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json(silent=True)
    corpo, status = auth_controller.login(dados)
    return jsonify(corpo), status


@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    corpo, status = auth_controller.logout()
    return jsonify(corpo), status


@auth_bp.route('/cadastro')
def cadastro_page():
    if not session.get('usuario_id'):
        return redirect(url_for('auth.login_page'))
    return render_template('cadastro.html')
