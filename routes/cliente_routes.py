from flask import Blueprint, request, jsonify, session

from controllers import cliente_controller

cliente_bp = Blueprint('clientes', __name__, url_prefix='/api/clientes')


def _resposta_nao_autenticado():
    return jsonify({
        'success': False,
        'message': 'Sessão expirada. Faça login novamente.'
    }), 401


@cliente_bp.route('', methods=['GET'])
def get_clientes():
    if not session.get('usuario_id'):
        return _resposta_nao_autenticado()

    corpo, status = cliente_controller.listar_clientes()
    return jsonify(corpo), status


@cliente_bp.route('', methods=['POST'])
def post_cliente():
    if not session.get('usuario_id'):
        return _resposta_nao_autenticado()

    dados = request.get_json(silent=True)
    corpo, status = cliente_controller.cadastrar_cliente(dados)
    return jsonify(corpo), status
