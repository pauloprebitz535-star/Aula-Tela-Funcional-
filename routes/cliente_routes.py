from flask import Blueprint, request, jsonify

from controllers import cliente_controller

cliente_bp = Blueprint('clientes', __name__, url_prefix='/api/clientes')


@cliente_bp.route('', methods=['GET'])
def get_clientes():
    corpo, status = cliente_controller.listar_clientes()
    return jsonify(corpo), status


@cliente_bp.route('', methods=['POST'])
def post_cliente():
    dados = request.get_json(silent=True)
    corpo, status = cliente_controller.cadastrar_cliente(dados)
    return jsonify(corpo), status