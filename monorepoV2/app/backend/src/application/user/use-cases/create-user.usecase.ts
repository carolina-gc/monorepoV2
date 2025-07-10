import { IUserRepository } from '../../../domain/repositories/user.repository';
import { ITypeUserRepository } from '../../../domain/repositories/typeuser.repository';
import { User } from '../../../domain/entities/user.entity';
import { hashPassword } from '../../../infrastructure/hash.service';

export class CreateUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private typeUserRepo: ITypeUserRepository
  ) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
    typeUserID: number;
  }): Promise<User> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error('Ya existe un usuario activo con ese correo');
    const typeUser = await this.typeUserRepo.findById(data.typeUserID);
    if (!typeUser) throw new Error('Tipo de usuario no encontrado');
    const hashed = await hashPassword(data.password);
    return this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashed,
      typeUser,
    });
  }
}
