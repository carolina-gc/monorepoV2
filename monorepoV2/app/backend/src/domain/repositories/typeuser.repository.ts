import { TypeUser } from '../entities/typeuser.entity';

export interface ITypeUserRepository {
  findById(id: number): Promise<TypeUser | null>;
  findAll(): Promise<TypeUser[]>;
} 