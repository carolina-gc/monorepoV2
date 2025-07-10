import { IUserRepository } from '../../../domain/repositories/user.repository';
import { comparePassword } from '../../../infrastructure/hash.service';
import { signJwt } from '../utils/jwt.util';
import { ETypeUser } from '../../../domain/enums/typeuser.enum';

export class LoginUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<{ user: { id: number; email: string; typeUser: ETypeUser }, token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Credenciales inválidas');
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error('Credenciales inválidas');
    const payload = {
      id: user.userID,
      email: user.email,
      typeUser: user.typeUser.type,
    };
    const token = signJwt(payload);
    return {
      user: payload,
      token,
    };
  }
} 