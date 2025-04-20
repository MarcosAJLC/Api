create table Alunos
(
  Id integer not null serial primary key,
  Nome text not null,
  Sobrenome text not null,
  Email text not null,
  Idade number not null,
  Peso float not null,
  Altura float not null,
  Created_at date not null,
  Updated_at date not null
)
