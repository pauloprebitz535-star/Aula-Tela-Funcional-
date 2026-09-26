import os

from dotenv import load_dotenv
import mysql.connector

load_dotenv()

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_USER = os.getenv('DB_USER', 'aluno06')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'C@nes2026')
DB_NAME = os.getenv('DB_NAME', 'aluno06')


def get_db_connection():    
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )