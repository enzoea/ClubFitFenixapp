CREATE DATABASE if not exists clubfit;
use clubfit;
CREATE TABLE if not exists usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  objetivo VARCHAR(250) NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  dataNascimento DATE NOT NULL
);


INSERT INTO usuarios (nome, email, senha, objetivo, telefone, dataNascimento)
VALUES 
('Enzo Martins', 'enzo@email.com', 'senha123','ganhar massa','31995860596','2004-03-30'),
('Mateus', 'mateusa@email.com', 'senha123', 'ganhar massa','31995860596','2004-03-30');
