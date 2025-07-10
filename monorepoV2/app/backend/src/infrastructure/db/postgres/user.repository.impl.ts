import { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { AppDataSource } from '../../database';
import { Repository } from 'typeorm';

export class UserRepositoryImpl implements IUserRepository {
  private repo: Repository<User>;
  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }
  async create(user: Partial<User>): Promise<User> {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email, deleted_at: null }, relations: ['typeUser'] });
  }
  async findAllActive(): Promise<User[]> {
    return this.repo.find({ where: { deleted_at: null }, relations: ['typeUser'] });
  }
  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { userID: id, deleted_at: null }, relations: ['typeUser'] });
  }
  async update(user: User): Promise<User> {
    return this.repo.save(user);
  }
  async softDelete(id: number): Promise<void> {
    await this.repo.update(id, { deleted_at: new Date() });
  }
} 