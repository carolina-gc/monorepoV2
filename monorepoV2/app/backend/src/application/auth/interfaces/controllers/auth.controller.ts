import { Request, Response } from 'express';
import { UserRepositoryImpl } from '../../../../infrastructure/db/postgres/user.repository.impl';
import { LoginUseCase } from '../../use-cases/login.use-case';

const userRepo = new UserRepositoryImpl();
const loginUseCase = new LoginUseCase(userRepo);

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y password son requeridos' });
    const result = await loginUseCase.execute(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message || 'Credenciales inválidas' });
  }
} 