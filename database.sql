-- Banco de dados do sistema de Login + Cadastro de Clientes

CREATE DATABASE IF NOT EXISTS cadastro_clientes;

USE cadastro_clientes;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuário de teste para conseguir fazer login imediatamente.
-- E-mail: teste@gmail.com
-- Senha:  Teste123!
-- (a senha abaixo já está com hash, nunca fica em texto puro no banco)
INSERT INTO usuarios (email, senha) VALUES (
    'teste@gmail.com',
    'pbkdf2:sha256:1000000$ciygY684kfGYIINM$89b56300f4d5df2f2b71f7f38f784ac19934ea05ede1002c4ac19445ba26ce95'
);
