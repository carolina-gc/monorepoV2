import React, { useState, useEffect } from 'react';
import { getUsers, User, UserFilters } from '../../application/services/user.service';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';
import { AdminLayout } from '../components/AdminLayout.component';
import { UserModal } from '../components/UserModal.component';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.component';
import { useAsyncOperation } from '../../application/hooks/useAsyncOperation';
import { PdfService } from '../../application/services/pdf.service';
import { CsvService } from '../../application/services/csv.service';
import './UsersList.page.css';

export const UsersListPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{ id: number; name: string } | null>(null);
  const { executeAsync } = useAsyncOperation();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allUsers]);

  const loadUsers = async () => {
    try {
      setError(null);
      const response = await executeAsync(
        () => getUsers(),
        'Cargando usuarios...'
      );
      if (response) {
        setAllUsers(response);
        setUsers(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    }
  };

  const applyFilters = () => {
    let filteredUsers = [...allUsers];

    if (filters.email) {
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }

    if (filters.typeUser) {
      filteredUsers = filteredUsers.filter(user =>
        user.typeUser.type === filters.typeUser as ETypeUser
      );
    }

    if (filters.numberPhone) {
      filteredUsers = filteredUsers.filter(user => {
        const userPhone = `${user.countryCode || ''}${user.numberPhone || ''}`;
        return (
          (user.numberPhone && user.numberPhone.toLowerCase().includes(filters.numberPhone!.toLowerCase())) ||
          (user.countryCode && user.countryCode.toLowerCase().includes(filters.numberPhone!.toLowerCase())) ||
          userPhone.toLowerCase().includes(filters.numberPhone!.toLowerCase())
        );
      });
    }

    setUsers(filteredUsers);
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleNewUser = () => {
    setEditingUserId(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (userId: number) => {
    setEditingUserId(userId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUserId(undefined);
  };

  const handleModalSuccess = () => {
    loadUsers(); // Recargar la lista después de crear/editar
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    setDeletingUser({ id: userId, name: userName });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  const handleDeleteSuccess = () => {
    loadUsers(); // Recargar la lista después de eliminar
  };

  const handleDownloadPdf = async () => {
    await executeAsync(
      async () => {
        // Generar y descargar PDF con los usuarios filtrados
        PdfService.generateUsersListPdf(users, filters);
      },
      'Generando PDF...'
    );
  };

  const handleDownloadCsv = async () => {
    await executeAsync(
      async () => {
        // Generar y descargar CSV con los usuarios filtrados
        CsvService.generateUsersListCsv(users, filters);
      },
      'Generando CSV...'
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeUserLabel = (typeUser: { type: ETypeUser }) => {
    return typeUser.type === ETypeUser.ADMIN ? 'Administrador' : 'Empleado';
  };

  const getTypeUserBadgeClass = (typeUser: { type: ETypeUser }) => {
    console.log('typeUser.type__', typeUser.type);
    
    return typeUser.type === ETypeUser.ADMIN ? 'badge-admin' : 'badge-employee';
  };

  return (
    <AdminLayout>
      <div className="users-container">
      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn-primary btn-small" onClick={handleNewUser}>
          + Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <h3>Filtros</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="email-filter">Correo electrónico:</label>
            <input
              id="email-filter"
              type="email"
              placeholder="Filtrar por correo..."
              value={filters.email || ''}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Tipo de usuario:</label>
            <select
              id="type-filter"
              value={filters.typeUser || ''}
              onChange={(e) => handleFilterChange('typeUser', e.target.value as ETypeUser)}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              <option value={ETypeUser.ADMIN}>Administrador</option>
              <option value={ETypeUser.EMPLOYEE}>Empleado</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="number-phone-filter">Teléfono:</label>
            <input
              id="number-phone-filter"
              type="text"
              placeholder="Buscar por código de país o número..."
              value={filters.numberPhone || ''}
              onChange={(e) => handleFilterChange('numberPhone', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-actions">
            <button 
              className="btn-secondary btn-small" 
              onClick={handleDownloadPdf}
              title="Descargar listado en PDF"
            >
              📄 Descargar PDF
            </button>
            <button 
              className="btn-secondary btn-small" 
              onClick={handleDownloadCsv}
              title="Descargar listado en CSV"
            >
              📊 Descargar CSV
            </button>
            <button 
              className="btn-secondary btn-small" 
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="users-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="no-users">
            <p>No se encontraron usuarios con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Tipo</th>
                  <th>Fecha de creación</th>
                  <th>Última actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userID}>
                    <td>{user.userID}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.countryCode}{user.numberPhone}</td>
                    <td>
                      <span className={`badge ${getTypeUserBadgeClass(user.typeUser)}`}>
                        {getTypeUserLabel(user.typeUser)}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.updatedAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-edit" 
                          onClick={() => handleEditUser(user.userID)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon btn-delete" 
                          onClick={() => handleDeleteUser(user.userID, user.name)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal de Usuario */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        userId={editingUserId}
      />

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onSuccess={handleDeleteSuccess}
        userId={deletingUser?.id}
        userName={deletingUser?.name}
      />
    </div>
    </AdminLayout>
  );
}; 