import React from 'react';
import { AdminLayout } from '../components/AdminLayout.component';
import { useAsyncOperation } from '../../application/hooks/useAsyncOperation';
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

  return (
  <AdminLayout>
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Administrador</h1>
        <p>Bienvenido al panel de administración</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Usuarios</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-content">
            <h3>Administradores</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👷</div>
          <div className="stat-content">
            <h3>Empleados</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={handleCreateUser}>
            <span className="action-icon">➕</span>
            <span>Crear Usuario</span>
          </button>
          <button className="action-btn" onClick={handleViewReports}>
            <span className="action-icon">📊</span>
            <span>Ver Reportes</span>
          </button>
          <button className="action-btn" onClick={handleSettings}>
            <span className="action-icon">⚙️</span>
            <span>Configuración</span>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
}; 