-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS clubfit;
USE clubfit;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  objetivo VARCHAR(255) NOT NULL,
  telefone VARCHAR(15) NOT NULL,
  dataNascimento DATE NOT NULL
);

CREATE TABLE profissionais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  dataNascimento DATE NOT NULL,
  objetivo TEXT NOT NULL,
  senha VARCHAR(255) NOT NULL,
  registro VARCHAR(50) NOT NULL,
  profissao VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabela de curtidas
CREATE TABLE IF NOT EXISTS curtidas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  treino_id INT NOT NULL,
  data_criacao DATETIME NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (treino_id) REFERENCES treinos(id),
  CONSTRAINT UNIQUE (usuario_id, treino_id)  -- Garantir que um usuário só possa curtir um post uma vez
);


-- Tabela de treinos
CREATE TABLE IF NOT EXISTS treinos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  inicio DATETIME NOT NULL,
  fim DATETIME NOT NULL,
  legenda TEXT, -- Adicionado para suportar legendas dos treinos
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela para fotos de treinos
CREATE TABLE IF NOT EXISTS treino_fotos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  treino_id INT NOT NULL,
  foto_url VARCHAR(500) NOT NULL, -- Campo para armazenar URLs das fotos
  FOREIGN KEY (treino_id) REFERENCES treinos(id)
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  treino_id INT NOT NULL,
  comentario TEXT NOT NULL,
  data_criacao DATETIME NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (treino_id) REFERENCES treinos(id)
);

SELECT * FROM usuarios;
SELECT * FROM treinos;
SELECT * FROM treino_fotos;
SELECT * FROM profissionais;
SELECT * FROM comentarios;
ALTER TABLE usuarios ADD COLUMN fotoPerfil VARCHAR(255);
ALTER TABLE treinos ADD COLUMN fotos VARCHAR(500);