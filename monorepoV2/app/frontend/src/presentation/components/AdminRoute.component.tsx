import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../application/hooks/useAuth';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Si no hay usuario logueado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no es administrador, redirigir al dashboard de empleado
  if (user.typeUser !== ETypeUser.admin) {
    return <Navigate to="/employee/home" replace />;
  }

  // Si es administrador, mostrar el contenido
  return <>{children}</>;
}; 