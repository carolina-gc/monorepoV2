import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User } from '../../domain/types/User';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export class PdfService {
  static generateUsersListPdf(users: User[], filters: any = {}) {
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Listado de Usuarios', 14, 22);
    
    // Información de filtros aplicados
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let yPosition = 35;
    
    const appliedFilters = [];
    if (filters.name) appliedFilters.push(`Nombre: ${filters.name}`);
    if (filters.email) appliedFilters.push(`Email: ${filters.email}`);
    if (filters.numberPhone) appliedFilters.push(`Teléfono: ${filters.numberPhone}`);
    if (filters.typeUser) {
      const typeLabel = filters.typeUser === ETypeUser.ADMIN ? 'Administrador' : 'Empleado';
      appliedFilters.push(`Tipo: ${typeLabel}`);
    }
    
    if (appliedFilters.length > 0) {
      doc.text('Filtros aplicados:', 14, yPosition);
      yPosition += 7;
      appliedFilters.forEach(filter => {
        doc.text(`• ${filter}`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }
    
    // Información de la tabla
    doc.text(`Total de usuarios: ${users.length}`, 14, yPosition);
    yPosition += 10;
    
    // Preparar datos para la tabla
    const tableData = users.map(user => [
      user.name,
      user.email,
      `${user.countryCode || ''}${user.numberPhone || ''}`,
      user.typeUser.type === ETypeUser.ADMIN ? 'Administrador' : 'Empleado',
      this.formatDate(user.createdAt || ''),
      this.formatDate(user.updatedAt || '')
    ]);
    
    // Generar tabla
    autoTable(doc, {
      head: [['Nombre', 'Email', 'Teléfono', 'Tipo', 'Fecha Creación', 'Fecha Actualización']],
      body: tableData,
      startY: yPosition,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10 },
    });
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString('es-ES')}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Descargar el PDF
    const fileName = `usuarios_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
  
  private static formatDate(dateString: string): string {
    if (!dateString) return '-';
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