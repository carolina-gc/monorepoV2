import React, { useState, useEffect } from 'react';
import { getUsers, User, UserFilters } from '../../application/services/user.service';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';
import { AdminLayout } from '../components/AdminLayout.component';
import { useAsyncOperation } from '../../application/hooks/useAsyncOperation';
import './UsersList.page.css';

export const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({});
  const { executeAsync } = useAsyncOperation();

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setError(null);
      const response = await executeAsync(
        () => getUsers(filters),
        'Cargando usuarios...'
      );
      if (response) {
        setUsers(response.users);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    }
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

  const handleNewUser = async () => {
    await executeAsync(
      async () => {
        // Simular operación de crear usuario
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Creando nuevo usuario...');
      },
      'Creando nuevo usuario...'
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

  const getTypeUserLabel = (typeUser: ETypeUser) => {
    return typeUser === ETypeUser.admin ? 'Administrador' : 'Empleado';
  };

  const getTypeUserBadgeClass = (typeUser: ETypeUser) => {
    return typeUser === ETypeUser.admin ? 'badge-admin' : 'badge-employee';
  };



  return (
    <AdminLayout>
      <div className="users-container">
      <div className="users-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={handleNewUser}>
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
              onChange={(e) => handleFilterChange('typeUser', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              <option value={ETypeUser.admin}>Administrador</option>
              <option value={ETypeUser.employee}>Empleado</option>
            </select>
          </div>

          <div className="filter-actions">
            <button 
              className="btn-secondary" 
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
                  <th>Correo</th>
                  <th>Tipo</th>
                  <th>Fecha de creación</th>
                  <th>Última actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
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
                          className="btn-edit" 
                          onClick={() => {}}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => {}}
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
    </div>
    </AdminLayout>
  );
}; 