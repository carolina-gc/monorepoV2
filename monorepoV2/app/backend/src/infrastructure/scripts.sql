

-- Tabla type_users
create table if not exists type_users (
  type_user_id serial primary key,
  type type_users_type_enum not null unique,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Tabla users
create table if not exists users (
  user_id serial primary key,
  name varchar(255) not null,
  email varchar(255) unique not null,
  password varchar(255) not null,
  number_phone varchar(10) not null,
  country_code varchar(5) not null,
  type_user_id integer references type_users(type_user_id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
); 

create table if not exists caro (
  caro_id serial primary key,
  name varchar(255) not null
); 
-- Insertar registros iniciales de type_users (solo si no existen)
INSERT INTO type_users (type, description) 
SELECT 'admin', 'Usuario administrador con acceso completo al sistema'
WHERE NOT EXISTS (SELECT 1 FROM type_users WHERE type = 'admin');

INSERT INTO type_users (type, description) 
SELECT 'employee', 'Usuario empleado con acceso limitado al sistema'
WHERE NOT EXISTS (SELECT 1 FROM type_users WHERE type = 'employee'); 
