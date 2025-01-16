CREATE DATABASE if not exists clubfit;
use clubfit;
CREATE TABLE if not exists usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL
);

INSERT INTO usuarios (nome, email, senha)
VALUES 
('Enzo Martins', 'enzo@email.com', 'senha123'),
('Mateus', 'mateusa@email.com', 'senha123');
