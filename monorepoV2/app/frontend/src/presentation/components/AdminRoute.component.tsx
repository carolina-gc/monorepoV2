import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../application/hooks/useAuth';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

interface AdminRouteProps {
  children: React.ReactNode;
}

function logoutAndRedirect() {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
  return <Navigate to="/login" replace />;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.typeUser) {
    case ETypeUser.ADMIN:
      return <>{children}</>;
    case ETypeUser.EMPLOYEE:
      return <Navigate to="/employee/home" replace />;
    default:
      return logoutAndRedirect();
  }
}; 