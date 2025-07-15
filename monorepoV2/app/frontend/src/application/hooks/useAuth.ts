import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout as authLogout, LoginResponse } from '../services/auth.service';
import { useAsyncOperation } from './useAsyncOperation';

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginResponse['user'] | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [error, setError] = useState<string | null>(null);
  const { executeAsync } = useAsyncOperation();

  const loginUser = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await executeAsync(
        () => login(email, password),
        'Iniciando sesión...'
      );
      
      if (res) {
        setUser(res.user);
        setToken(res.token);
        
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        
        return res;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const logout = () => {
    // Limpiar estado
    setUser(null);
    setToken(null);
    setError(null);
    
    // Usar la función del servicio para limpiar localStorage
    authLogout();
    
    // Redirigir al login inmediatamente
    navigate('/login', { replace: true });
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  return { user, token, error, loginUser, logout, isAuthenticated };
} 