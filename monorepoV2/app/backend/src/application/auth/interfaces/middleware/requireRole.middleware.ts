import { Request, Response, NextFunction } from 'express';
import { ETypeUser } from '../../../../domain/enums/typeuser.enum';

export function requireRole(...roles: ETypeUser[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.typeUser)) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
    }
    next();
  };
} 