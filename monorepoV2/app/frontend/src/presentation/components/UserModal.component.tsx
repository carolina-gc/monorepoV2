import React, { useState, useEffect } from 'react';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';
import { User, CreateUserData, UpdateUserData, getUserById, createUser, updateUser } from '../../application/services/user.service';
import { useAsyncOperation } from '../../application/hooks/useAsyncOperation';
import { PasswordInput } from './PasswordInput.component';
import './UserModal.component.css';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId?: number; // Si se proporciona, es modo edición
}

export const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userId 
}) => {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    typeUserID: 1, // Por defecto ADMIN
    numberPhone: '',
    countryCode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { executeAsync } = useAsyncOperation();
  const isEditMode = !!userId;

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    } else if (isOpen && !userId) {
      // Reset form for create mode
      setFormData({
        name: '',
        email: '',
        password: '',
        typeUserID: 1,
        numberPhone: '',
        countryCode: ''
      });
      setErrors({});
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    if (!userId) return;
    
    try {
      const user = await executeAsync(
        () => getUserById(userId),
        'Cargando datos del usuario...'
      );
      
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '', // No cargar password en edición
          typeUserID: user.typeUser.typeuserID,
          numberPhone: user.numberPhone || '',
          countryCode: user.countryCode || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validación del nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'El nombre excede de caracteres';
    }

    // Validación del email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    } else if (formData.email.length > 255) {
      newErrors.email = 'El correo excede de caracteres';
    }

    // Validación de la contraseña (solo en modo crear)
    if (!isEditMode && !formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!isEditMode && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!isEditMode && formData.password.length > 255) {
      newErrors.password = 'La contraseña excede de caracteres';
    }

    // Validación del número de teléfono
    if (formData.numberPhone) {
      if (!/^\d+$/.test(formData.numberPhone)) {
        newErrors.numberPhone = 'El número debe contener solo dígitos';
      } else if (formData.numberPhone.length > 10) {
        newErrors.numberPhone = 'El número excede de dígitos';
      }
    }

    // Validación del código de país
    if (formData.countryCode) {
      if (!/^\+?\d+$/.test(formData.countryCode)) {
        newErrors.countryCode = 'Código de país inválido';
      } else if (formData.countryCode.length > 5) {
        newErrors.countryCode = 'El código de país excede de caracteres';
      }
    }

    // Validación de coherencia: si hay número de teléfono, debe haber código de país
    if (formData.numberPhone && !formData.countryCode) {
      newErrors.countryCode = 'El código de país es obligatorio cuando se proporciona un número de teléfono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isEditMode && userId) {
        const updateData: UpdateUserData = {
          name: formData.name,
          email: formData.email,
          typeUserID: formData.typeUserID,
          numberPhone: formData.numberPhone || undefined,
          countryCode: formData.countryCode || undefined
        };
        
        await executeAsync(
          () => updateUser(userId, updateData),
          'Actualizando usuario...'
        );
      } else {
        await executeAsync(
          () => createUser(formData),
          'Creando usuario...'
        );
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className={errors.name ? 'error' : ''}
              placeholder="Nombre completo"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {!isEditMode && (
            <div className="form-group">
              <PasswordInput
                label="Contraseña *"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                error={errors.password}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="typeUserID">Tipo de usuario *</label>
            <select
              id="typeUserID"
              value={formData.typeUserID}
              onChange={e => handleInputChange('typeUserID', parseInt(e.target.value))}
            >
              <option value={1}>Administrador</option>
              <option value={2}>Empleado</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="countryCode">Código de país</label>
              <input
                id="countryCode"
                type="text"
                value={formData.countryCode}
                onChange={e => handleInputChange('countryCode', e.target.value)}
                className={errors.countryCode ? 'error' : ''}
                placeholder="+57"
              />
              {errors.countryCode && <span className="error-message">{errors.countryCode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="numberPhone">Número de teléfono</label>
              <input
                id="numberPhone"
                type="text"
                value={formData.numberPhone}
                onChange={e => handleInputChange('numberPhone', e.target.value)}
                className={errors.numberPhone ? 'error' : ''}
                placeholder="3001234567"
              />
              {errors.numberPhone && <span className="error-message">{errors.numberPhone}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 