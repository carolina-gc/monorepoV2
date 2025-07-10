import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findAllActive(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  update(user: User): Promise<User>;
  softDelete(id: number): Promise<void>;
} 