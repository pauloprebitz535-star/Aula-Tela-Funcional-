from database import get_db_connection


class Cliente:
    """Concentra todo o acesso à tabela 'clientes' no MySQL."""

    @staticmethod
    def listar_todos():
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                'SELECT id, nome, email, telefone, cidade FROM clientes ORDER BY id ASC'
            )
            return cursor.fetchall()
        finally:
            if cursor is not None:
                cursor.close()
            if conn is not None and conn.is_connected():
                conn.close()

    @staticmethod
    def buscar_por_email(email):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute('SELECT id FROM clientes WHERE email = %s', (email,))
            return cursor.fetchone()
        finally:
            if cursor is not None:
                cursor.close()
            if conn is not None and conn.is_connected():
                conn.close()

    @staticmethod
    def criar(nome, email, telefone, cidade):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                'INSERT INTO clientes (nome, email, telefone, cidade) VALUES (%s, %s, %s, %s)',
                (nome, email, telefone, cidade)
            )
            conn.commit()
            return cursor.lastrowid
        finally:
            if cursor is not None:
                cursor.close()
            if conn is not None and conn.is_connected():
                conn.close()