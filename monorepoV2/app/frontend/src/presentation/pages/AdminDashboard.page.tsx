import React from 'react';
import { AdminLayout } from '../components/AdminLayout.component';
import { useAsyncOperation } from '../../application/hooks/useAsyncOperation';
import { testConnection } from '../../application/services/test.service';
import './AdminDashboard.page.css';

export const AdminDashboard: React.FC = () => {
  const { executeAsync } = useAsyncOperation();

  const handleCreateUser = async () => {
    await executeAsync(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Navegando a crear usuario...');
      },
      'Preparando formulario...'
    );
  };

  const handleViewReports = async () => {
    await executeAsync(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Cargando reportes...');
      },
      'Cargando reportes...'
    );
  };

  const handleSettings = async () => {
    await executeAsync(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Abriendo configuración...');
      },
      'Abriendo configuración...'
    );
  };

  const handleTestConnection = async () => {
    try {
      const response = await executeAsync(
        () => testConnection(),
        'Probando conexión...'
      );
      if (response) {
        alert(`Conexión exitosa: ${response.message}`);
      }
    } catch (error) {
      alert(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
  <AdminLayout>
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Administrador</h1>
        <p>Bienvenido al panel de administración</p>
      </div>
      
      <div className="dashboard-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          <button className="btn-primary btn-large" onClick={handleCreateUser}>
            <span className="action-icon">➕</span>
            <span>Crear Usuario</span>
          </button>
          <button className="btn-primary btn-large" onClick={handleViewReports}>
            <span className="action-icon">📊</span>
            <span>Ver Reportes</span>
          </button>
          <button className="btn-primary btn-large" onClick={handleSettings}>
            <span className="action-icon">⚙️</span>
            <span>Configuración</span>
          </button>
          <button className="btn-primary btn-large" onClick={handleTestConnection}>
            <span className="action-icon">🔗</span>
            <span>Probar Conexión</span>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
}; 