import { ITypeUserRepository } from '../../../domain/repositories/typeuser.repository';
import { TypeUser } from '../../../domain/entities/typeuser.entity';
import { AppDataSource } from '../../database';
import { Repository } from 'typeorm';

export class TypeUserRepositoryImpl implements ITypeUserRepository {
  private repo: Repository<TypeUser>;
  constructor() {
    this.repo = AppDataSource.getRepository(TypeUser);
  }
  async findById(id: number): Promise<TypeUser | null> {
    return this.repo.findOneBy({ typeuserID: id });
  }
  async findAll(): Promise<TypeUser[]> {
    return this.repo.find();
  }
} 