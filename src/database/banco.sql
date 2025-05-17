create table if not exists Alunos
(
  Id serial primary key,
  Nome text not null,
  Sobrenome text not null,
  Email text not null,
  Idade integer not null,
  Peso float not null,
  Altura float not null,
  Created_at date not null,
  Updated_at date not null
);
ALTER TABLE Alunos
ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE Alunos
ALTER COLUMN updated_at SET DEFAULT now();
alter table Alunos
alter COLUMN Email unique;

create table if not exists Users(
  Id serial primary key,
  Nome text not null,
  password_hash text not null,
  Email text not null unique,
  Created_at date not null,
  Updated_at date not null
);
ALTER TABLE Users
ALTER COLUMN created_at SET DEFAULT now();






