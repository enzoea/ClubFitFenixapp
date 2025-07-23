create table Usuarios(
	id serial primary key,
	nome varchar(100) not null,
	email varchar(100) unique not null,
	senha varchar(100) not null,
	objetivo varchar(255) not null,
	telefone varchar(15) not null,
	dataNascimento DATE not null,
	
);

alter table Usuarios
add column data_criacao timestamp default current_timestamp;

select * from Usuarios