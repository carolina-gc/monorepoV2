import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export function typeUserPipe(type: ETypeUser): string {
  switch (type) {
    case ETypeUser.ADMIN:
      return 'Administrador';
    case ETypeUser.EMPLOYEE:
      return 'Empleado';
    default:
      return 'Desconocido';
  }
} 