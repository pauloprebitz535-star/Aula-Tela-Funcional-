import getpass

from mysql.connector import Error
from werkzeug.security import generate_password_hash

from controllers.auth_controller import email_valido, senha_valida
from database import get_db_connection


def main():
    email = input('E-mail (Gmail): ').strip()

    if not email_valido(email):
        print('E-mail inválido. Utilize um endereço Gmail, por exemplo: exemplo@gmail.com')
        return

    senha = getpass.getpass('Senha (não aparece enquanto você digita): ')

    if not senha_valida(senha):
        print('Senha deve ter no mínimo 6 caracteres, com letra maiúscula, minúscula, número e caractere especial.')
        return

    senha_hash = generate_password_hash(senha, method='pbkdf2:sha256')

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO usuarios (email, senha) VALUES (%s, %s)',
            (email, senha_hash)
        )
        conn.commit()
        print('Usuário criado com sucesso:', email)

    except Error as e:
        if e.errno == 1062:
            print('Já existe um usuário com este e-mail.')
        else:
            print('Erro ao acessar o banco de dados:', e)

    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None and conn.is_connected():
            conn.close()


if __name__ == '__main__':
    main()