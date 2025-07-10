import { DataSource } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { TypeUser } from '../domain/entities/typeuser.entity';

const DB_HOST = process.env.DB_HOST ;
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true, // Solo para desarrollo
  logging: false,
  entities: [User, TypeUser],
  migrations: [],
  subscribers: [],
});

// Para inicializar la conexión en main.ts:
// await AppDataSource.initialize(); 