import React from 'react';
import { deleteUser } from '../../application/services/user.service';
import { useAsyncOperation } from '../../application/hooks/useAsyncOperation';
import './DeleteConfirmModal.component.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId?: number;
  userName?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userName
}) => {
  const { executeAsync } = useAsyncOperation();

  const handleDelete = async () => {
    if (!userId) return;

    try {
      await executeAsync(
        () => deleteUser(userId),
        'Eliminando usuario...'
      );
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="warning-icon">⚠️</div>
          <p className="warning-text">
            ¿Estás seguro que deseas eliminar el registro del usuario <strong>"{userName}"</strong>?
          </p>
          <p className="warning-description">
            Esta acción no se puede deshacer. El usuario será marcado como eliminado y no podrá acceder al sistema.
          </p>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-danger" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}; 