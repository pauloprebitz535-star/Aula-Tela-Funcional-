from database import get_db_connection


class Usuario:
    """Concentra todo o acesso à tabela 'usuarios' no MySQL."""

    @staticmethod
    def buscar_por_email(email):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                'SELECT id, email, senha FROM usuarios WHERE email = %s', (email,)
            )
            return cursor.fetchone()
        finally:
            if cursor is not None:
                cursor.close()
            if conn is not None and conn.is_connected():
                conn.close()
