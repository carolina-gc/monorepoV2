import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../application/hooks/useAuth';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

interface EmployeeRouteProps {
  children: React.ReactNode;
}

export const EmployeeRoute: React.FC<EmployeeRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Si no hay usuario logueado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no es empleado, redirigir al dashboard de admin
  if (user?.typeUser !== ETypeUser.employee) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Si es empleado, mostrar el contenido
  return <>{children}</>;
}; 