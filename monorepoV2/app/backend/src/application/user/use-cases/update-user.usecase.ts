import { IUserRepository } from '../../../domain/repositories/user.repository';
import { ITypeUserRepository } from '../../../domain/repositories/typeuser.repository';
import { hashPassword } from '../../../infrastructure/hash.service';
import { User } from '../../../domain/entities/user.entity';

export class UpdateUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private typeUserRepo: ITypeUserRepository
  ) {}

  async execute(
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      typeUserID?: number;
    }
  ): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error('Usuario no encontrado');
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.password) user.password = await hashPassword(data.password);
    if (data.typeUserID) {
      const typeUser = await this.typeUserRepo.findById(data.typeUserID);
      if (!typeUser) throw new Error('Tipo de usuario no encontrado');
      user.typeUser = typeUser;
    }
    return this.userRepo.update(user);
  }
}
