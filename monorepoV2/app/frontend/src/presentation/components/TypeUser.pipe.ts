import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export function typeUserPipe(type: ETypeUser): string {
  switch (type) {
    case ETypeUser.admin:
      return 'Administrador';
    case ETypeUser.employee:
      return 'Empleado';
    default:
      return 'Desconocido';
  }
} 