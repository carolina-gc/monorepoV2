import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../application/hooks/useAuth';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';
import './Sidebar.component.css';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isAdmin = user?.typeUser === ETypeUser.ADMIN;
  const isEmployee = user?.typeUser === ETypeUser.EMPLOYEE;

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h3 className={collapsed ? 'hidden' : ''}>
          {isAdmin ? 'Panel Admin' : 'Panel Empleado'}
        </h3>
        <button className="toggle-btn" onClick={handleToggle}>
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {isAdmin && (
            <>
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                >
                  <span className="icon">🏠</span>
                  <span className={collapsed ? 'hidden' : ''}>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/users" 
                  className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                >
                  <span className="icon">👥</span>
                  <span className={collapsed ? 'hidden' : ''}>Usuarios</span>
                </Link>
              </li>
            </>
          )}
          
          {isEmployee && (
            <li>
              <Link 
                to="/employee/home" 
                className={`nav-link ${isActive('/employee/home') ? 'active' : ''}`}
              >
                <span className="icon">🏠</span>
                <span className={collapsed ? 'hidden' : ''}>Inicio</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
      
      {/* Botón de logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span className="icon">🚪</span>
          <span className={collapsed ? 'hidden' : ''}>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}; 