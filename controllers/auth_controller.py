import re

from flask import session
from mysql.connector import Error
from werkzeug.security import check_password_hash

from models.usuario import Usuario


# Só aceita e-mails no formato usuario@gmail.com
EMAIL_REGEX = re.compile(
    r'^[^@\s]+@gmail\.com$',
    re.IGNORECASE
)


# Mínimo 6 caracteres:
# - 1 letra minúscula
# - 1 letra maiúscula
# - 1 número
# - 1 caractere especial
SENHA_REGEX = re.compile(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$'
)


def email_valido(email):
    return bool(EMAIL_REGEX.match(email))


def senha_valida(senha):
    return bool(SENHA_REGEX.match(senha))


def login(dados):
    """Valida as credenciais e cria a sessão.
    Retorna (corpo, status_http).
    """

    if not dados:
        return {
            'success': False,
            'message': 'Dados inválidos.'
        }, 400

    email = (dados.get('email') or '').strip()
    senha = dados.get('senha') or ''

    # Validação do e-mail
    if not email:
        return {
            'success': False,
            'message': 'Preencha o e-mail.'
        }, 400

    if not email_valido(email):
        return {
            'success': False,
            'message': 'E-mail inválido. Utilize um endereço Gmail, por exemplo: exemplo@gmail.com'
        }, 400

    # Validação da senha
    if not senha:
        return {
            'success': False,
            'message': 'Preencha a senha.'
        }, 400

    if not senha_valida(senha):
        return {
            'success': False,
            'message': 'Senha deve ter no mínimo 6 caracteres, com letra maiúscula, minúscula, número e caractere especial.'
        }, 400

    try:
        # Procura o usuário no banco
        usuario = Usuario.buscar_por_email(email)

        # Verifica usuário e senha
        if not usuario or not check_password_hash(
            usuario['senha'],
            senha
        ):
            return {
                'success': False,
                'message': 'E-mail ou senha incorretos.'
            }, 401

        # Cria a sessão
        session['usuario_id'] = usuario['id']

        return {
            'success': True,
            'message': 'Login realizado com sucesso.'
        }, 200

    except Error as e:
        print("Erro no banco:", e)

        return {
            'success': False,
            'message': 'Erro ao conectar ao banco de dados.'
        }, 500


def logout():
    """Encerra a sessão do usuário."""

    session.pop('usuario_id', None)

    return {
        'success': True,
        'message': 'Sessão encerrada.'
    }, 200