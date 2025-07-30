create table usuarios(
	id serial primary key,
	nome varchar(100) not null,
	email varchar(100) unique not null,
	senha varchar(100) not null,
	objetivo varchar(255) not null,
	telefone varchar(15) not null,
	dataNascimento DATE not null
);

alter table usuarios
add column data_criacao timestamp default current_timestamp;


select * from usuarios;

create table profissionais (
	id serial primary key,
	nome varchar(255) not null,
	telefone varchar(20) not null,
	email varchar(255) not null unique,
	dataNascimento DATE not null,
	objetivo text not null,
	senha varchar(255) not null,
	registro varchar(50) not null,
	profissao varchar(50) not null,
	data_criacao timestamp default current_timestamp
);

create table fichas_treino (
	id serial primary key,
	id_profissional int not null,
	id_usuario int not null,
	objetivo varchar(255),
	data_criacao timestamp default current_timestamp,
	foreign key (id_profissional) references profissionais(id) on delete cascade,
	foreign key (id_profissional) references profissionais(id) on delete cascade
)

CREATE TABLE IF NOT EXISTS treinos (
  id serial PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  inicio timestamp NOT NULL,
  fim timestamp NOT NULL,
  legenda TEXT, 
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);


CREATE TABLE exercicios_ficha (
    id serial PRIMARY KEY,
    id_ficha INT NOT NULL,
    nome_exercicio VARCHAR(255) NOT NULL,
    series INT NOT NULL,
    repeticoes INT NOT NULL,
    carga VARCHAR(50),
    observacoes varchar(50),
    FOREIGN KEY (id_ficha) REFERENCES fichas_treino(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS curtidas (
  id serial PRIMARY KEY,
  usuario_id INT NOT NULL,
  treino_id INT NOT NULL,
  data_criacao timestamp default current_timestamp,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
  FOREIGN KEY (treino_id) REFERENCES treinos(id)
);


CREATE TABLE IF NOT EXISTS comentarios (
  id serial PRIMARY KEY,
  usuario_id INT NOT NULL,
  treino_id INT NOT NULL,
  comentario TEXT NOT NULL,
  data_criacao timestamp default current_timestamp,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
  FOREIGN KEY (treino_id) REFERENCES treinos(id)
);

CREATE TABLE IF NOT EXISTS treino_fotos (
  id serial PRIMARY KEY,
  treino_id INT NOT NULL,
  foto_url VARCHAR(500) NOT NULL, 
  FOREIGN KEY (treino_id) REFERENCES treinos(id)
);


SELECT * FROM usuarios;
SELECT * FROM treinos;
SELECT * FROM treino_fotos;
SELECT * FROM profissionais;
SELECT * FROM ficha_treino;
SELECT * FROM exercicios_ficha;
SELECT * FROM comentarios;