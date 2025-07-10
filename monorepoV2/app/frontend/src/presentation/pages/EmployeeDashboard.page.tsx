import React from 'react';
import { EmployeeLayout } from '../components/EmployeeLayout.component';
import './EmployeeDashboard.page.css';

export const EmployeeDashboard: React.FC = () => (
  <EmployeeLayout>
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Empleado</h1>
        <p>Bienvenido al panel de empleado</p>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>¡Bienvenido!</h2>
          <p>Has iniciado sesión como empleado. Aquí puedes acceder a las funcionalidades disponibles para tu rol.</p>
        </div>
        
        <div className="employee-info">
          <h3>Información de tu cuenta</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Tipo de usuario:</span>
              <span className="info-value">Empleado</span>
            </div>
            <div className="info-item">
              <span className="info-label">Acceso:</span>
              <span className="info-value">Limitado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </EmployeeLayout>
); 