import { User } from '../../domain/types/User';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export class CsvService {
  static generateUsersListCsv(users: User[], filters: any = {}) {
    // Encabezados del CSV
    const headers = [
      'ID',
      'Nombre',
      'Email',
      'Teléfono',
      'Tipo de Usuario',
      'Fecha de Creación',
      'Fecha de Actualización'
    ];

    // Datos de los usuarios
    const csvData = users.map(user => [
      user.userID,
      this.escapeCsvField(user.name),
      this.escapeCsvField(user.email),
      this.escapeCsvField(`${user.countryCode || ''}${user.numberPhone || ''}`),
      this.escapeCsvField(user.typeUser.type === ETypeUser.ADMIN ? 'Administrador' : 'Empleado'),
      this.formatDate(user.createdAt),
      this.formatDate(user.updatedAt)
    ]);

    // Agregar encabezados al inicio
    const allData = [headers, ...csvData];

    // Convertir a formato CSV
    const csvContent = allData
      .map(row => row.join(','))
      .join('\n');

    // Crear el archivo y descargarlo
    const blob = new Blob(['\ufeff' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar la URL del objeto
    URL.revokeObjectURL(url);
  }

  private static escapeCsvField(field: string): string {
    if (!field) return '';
    
    // Si el campo contiene comas, comillas o saltos de línea, lo envolvemos en comillas
    if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
      // Escapar comillas dobles duplicándolas
      const escapedField = field.replace(/"/g, '""');
      return `"${escapedField}"`;
    }
    
    return field;
  }

  private static formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 