import { DataSource } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import { TypeUser } from '../domain/entities/typeuser.entity';
import { hashPassword } from './hash.service';

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
  synchronize: false, // Deshabilitado para usar script SQL manual
  logging: false,
  entities: [User, TypeUser],
  migrations: [],
  subscribers: [],
});

// Función para insertar datos iniciales
export async function insertInitialData() {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    
    // Insertar tipos de usuario si no existen
    const adminResult = await queryRunner.query(`
      INSERT INTO type_users (type, description) 
      SELECT 'admin', 'Usuario administrador con acceso completo al sistema'
      WHERE NOT EXISTS (SELECT 1 FROM type_users WHERE type = 'admin')
      RETURNING type_user_id;
    `);
    
    const employeeResult = await queryRunner.query(`
      INSERT INTO type_users (type, description) 
      SELECT 'employee', 'Usuario empleado con acceso limitado al sistema'
      WHERE NOT EXISTS (SELECT 1 FROM type_users WHERE type = 'employee')
      RETURNING type_user_id;
    `);
    
    // Contar total de inserts realizados en type_users
    const totalTypeUserInserts = adminResult.length + employeeResult.length;
    
    if (totalTypeUserInserts > 0) {
      console.log(`✅ Se realizaron ${totalTypeUserInserts} inserts a la tabla "type_users" correctamente`);
    }
    
    // Insertar usuario admin inicial si no existe
    const hashedPassword = await hashPassword('123456');
    const adminUserResult = await queryRunner.query(`
      INSERT INTO users (name, email, password, number_phone, country_code, type_user_id) 
      SELECT 'Administrador', 'admin@example.com', $1, '1234567890', '+57', type_user_id
      FROM type_users 
      WHERE type = 'admin' 
      AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com')
      RETURNING user_id;
    `, [hashedPassword]);
    
    if (adminUserResult.length > 0) {
      console.log(`✅ Se realizó 1 insert a la tabla "users" correctamente`);
    }
  } catch (error) {
    console.error('❌ Error al insertar datos iniciales:', error);
  }
}

// Para inicializar la conexión en main.ts:
// await AppDataSource.initialize();
// await insertInitialData(); 