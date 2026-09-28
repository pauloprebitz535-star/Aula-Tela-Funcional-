import re

from mysql.connector import Error

from models.cliente import Cliente

# Só aceita e-mails no formato usuario@gmail.com
EMAIL_REGEX = re.compile(r'^[^@\s]+@gmail\.com$', re.IGNORECASE)


def email_valido(email):
    return bool(EMAIL_REGEX.match(email))


def listar_clientes():
    """Retorna (corpo, status_http) com a lista de clientes cadastrados."""
    try:
        clientes = Cliente.listar_todos()
        return clientes, 200

    except Error as e:
        print(e)
        return {
            'success': False,
            'message': 'Erro ao conectar ao banco de dados.'
        }, 500


def cadastrar_cliente(dados):
    """Valida os dados recebidos e cadastra um novo cliente.

    Retorna sempre uma tupla (corpo, status_http).
    """
    if not dados:
        return {'success': False, 'message': 'Dados inválidos.'}, 400

    nome = (dados.get('nome') or '').strip()
    email = (dados.get('email') or '').strip()
    telefone = (dados.get('telefone') or '').strip()
    cidade = (dados.get('cidade') or '').strip()

    if not nome:
        return {'success': False, 'message': 'Preencha o nome.'}, 400

    if not email:
        return {'success': False, 'message': 'Preencha o e-mail.'}, 400

    if not email_valido(email):
        return {
            'success': False,
            'message': 'E-mail inválido. Utilize um endereço Gmail, por exemplo: exemplo@gmail.com'
        }, 400

    if not telefone:
        return {'success': False, 'message': 'Preencha o telefone.'}, 400

    if not telefone.isdigit():
        return {'success': False, 'message': 'Telefone deve conter apenas números.'}, 400

    if len(telefone) < 11:
        return {
            'success': False,
            'message': 'Telefone inválido. Digite o DDD + número com 11 dígitos.'
        }, 400

    if len(telefone) > 11:
        return {
            'success': False,
            'message': 'Telefone inválido. Digite somente 11 números.'
        }, 400

    if not cidade:
        return {'success': False, 'message': 'Preencha a cidade.'}, 400

    try:
        if Cliente.buscar_por_email(email):
            return {
                'success': False,
                'message': 'Já existe um cliente cadastrado com este e-mail.'
            }, 409

        novo_id = Cliente.criar(nome, email, telefone, cidade)

        return {
            'success': True,
            'message': 'Cliente cadastrado com sucesso',
            'cliente': {
                'id': novo_id,
                'nome': nome,
                'email': email,
                'telefone': telefone,
                'cidade': cidade
            }
        }, 201

    except Error as e:
        print(e)
        return {
            'success': False,
            'message': 'Erro ao conectar ao banco de dados.'
        }, 500