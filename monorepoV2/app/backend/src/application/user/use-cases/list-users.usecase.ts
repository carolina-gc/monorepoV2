import { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

export class ListUsersUseCase {
  constructor(private userRepo: IUserRepository) {}
  async execute(): Promise<User[]> {
    return this.userRepo.findAllActive();
  }
}
