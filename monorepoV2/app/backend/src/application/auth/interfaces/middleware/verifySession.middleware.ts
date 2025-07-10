import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../utils/jwt.util';

export function verifySession(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyJwt<any>(token);
  if (!payload) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
  (req as any).user = payload;
  next();
} 