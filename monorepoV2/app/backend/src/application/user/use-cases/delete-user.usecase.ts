import { IUserRepository } from '../../../domain/repositories/user.repository';

export class DeleteUserUseCase {
  constructor(private userRepo: IUserRepository) {}
  async execute(id: number): Promise<void> {
    await this.userRepo.softDelete(id);
  }
} 