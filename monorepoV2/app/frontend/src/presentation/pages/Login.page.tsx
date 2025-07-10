import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PasswordInput } from '../components/PasswordInput.component';
import { useAuth } from '../../application/hooks/useAuth';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { loginUser, error } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError('Correo inválido');
      valid = false;
    }
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await loginUser(email, password);
    if (res && res.user) {
      if (res.user.typeUser === ETypeUser.admin) {
        navigate('/admin/dashboard');
      } else if (res.user.typeUser === ETypeUser.employee) {
        navigate('/employee/home');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%' }}
            autoComplete="username"
          />
          {emailError && <div className="error">{emailError}</div>}
        </div>
        <PasswordInput
          label="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          error={passwordError}
        />
        <button type="submit" style={{ width: '100%', marginTop: 8 }}>
          Ingresar
        </button>
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  );
}; 