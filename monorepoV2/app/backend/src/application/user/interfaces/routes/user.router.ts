import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../../../infrastructure/database';
import { User } from '../../../../domain/entities/user.entity';
import { TypeUser } from '../../../../domain/entities/typeuser.entity';
import { hashPassword } from '../../../../infrastructure/hash.service';
import { z } from 'zod';
import { verifySession } from '../../../auth/interfaces/middleware/verifySession.middleware';
import { requireRole } from '../../../auth/interfaces/middleware/requireRole.middleware';
import { ETypeUser } from '../../../../domain/enums/typeuser.enum';

const router = Router();
const userRepo = () => AppDataSource.getRepository(User);
const typeUserRepo = () => AppDataSource.getRepository(TypeUser);

// Aplicar middleware de verificación de sesión a todas las rutas
router.use(verifySession);

// Esquema de validación para crear usuario
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  typeUserID: z.number(),
});

// Listar usuarios no eliminados (admin y employee)
router.get('/', requireRole(ETypeUser.ADMIN, ETypeUser.EMPLOYEE), async (_req: Request, res: Response) => {
  try {
    const users = await userRepo().find({
      where: { deleted_at: null },
      relations: ['typeUser'],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar usuarios', error: err });
  }
});

// Crear usuario (solo admin)
router.post('/', requireRole(ETypeUser.ADMIN), async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const { name, email, password, typeUserID } = parsed.data;
    // Verificar si ya existe un usuario activo con ese email
    const existing = await userRepo().findOne({
      where: { email, deleted_at: null },
    });
    if (existing)
      return res
        .status(409)
        .json({ message: 'Ya existe un usuario activo con ese correo' });
    const typeUser = await typeUserRepo().findOneBy({ typeuserID: typeUserID });
    if (!typeUser)
      return res.status(404).json({ message: 'Tipo de usuario no encontrado' });
    const hashed = await hashPassword(password);
    const user = userRepo().create({ name, email, password: hashed, typeUser });
    await userRepo().save(user);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario', error: err });
  }
});

// get usuario no eliminado por id (admin y employee)
router.get('/:id', requireRole(ETypeUser.ADMIN, ETypeUser.EMPLOYEE), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const users = await userRepo().findOne({
      where: {  userID: id, deleted_at: null },
      relations: ['typeUser'],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar usuarios', error: err });
  }
});

// Actualizar usuario (solo admin)
router.put('/:id', requireRole(ETypeUser.ADMIN), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userRepo().findOne({
      where: { userID: id, deleted_at: null },
    });
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });
    const { name, email, password, typeUserID } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hashPassword(password);
    if (typeUserID) {
      const typeUser = await typeUserRepo().findOneBy({
        typeuserID: typeUserID,
      });
      if (!typeUser)
        return res
          .status(404)
          .json({ message: 'Tipo de usuario no encontrado' });
      user.typeUser = typeUser;
    }
    await userRepo().save(user);
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error al actualizar usuario', error: err });
  }
});

// Eliminar usuario (soft delete) (solo admin)
router.delete('/:id', requireRole(ETypeUser.ADMIN), async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userRepo().findOne({
      where: { userID: id, deleted_at: null },
    });
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });
    user.deleted_at = new Date();
    await userRepo().save(user);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: err });
  }
});

export default router;
