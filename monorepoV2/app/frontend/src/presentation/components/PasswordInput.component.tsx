import React, { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginBottom: 16, width: '100%' }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={show ? 'text' : 'password'}
          {...props}
          style={{ 
            paddingRight: 32, 
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <span
          onClick={() => setShow((s) => !s)}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            userSelect: 'none',
            zIndex: 1,
          }}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {show ? '🙈' : '👁️'}
        </span>
      </div>
      {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
    </div>
  );
}; 