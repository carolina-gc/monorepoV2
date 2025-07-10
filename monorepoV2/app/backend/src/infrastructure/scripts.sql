-- Script para crear el enum de type_users
do $$
begin
  if not exists (select 1 from pg_type where typname = 'typeuser_enum') then
    create type typeuser_enum as enum ('admin', 'employee');
  end if;
end$$;

-- Tabla type_users
create table if not exists type_users (
  typeuserID serial primary key,
  type typeuser_enum not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Tabla users
create table if not exists users (
  userID serial primary key,
  name varchar(255) not null,
  email varchar(255) unique not null,
  password varchar(255) not null,
  typeUserID integer references type_users(typeuserID),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
); 