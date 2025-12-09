import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../api/authService';

export default function MiPerfil() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  // Estados para tabs
  const [activeTab, setActiveTab] = useState('datos');

  // Estados para editar perfil
  const [editando, setEditando] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    fecha_nacimiento: user?.fecha_nacimiento || '',
    direccion: user?.direccion || '',
  });

  // Estados para cambiar contraseña
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);

    try {
      const updatedUser = await authService.updateProfile(formData);
      
      // Actualizar el usuario completo en el store (CAMBIO AQUÍ)
      const nuevoUser = {
        ...user,
        ...updatedUser,
      };
      
      updateUser(nuevoUser);
      
      alert('✅ Perfil actualizado exitosamente');
      setEditando(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      const errorMsg = error.response?.data;
      if (typeof errorMsg === 'object') {
        const firstError = Object.values(errorMsg)[0];
        alert(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        alert('Error al actualizar perfil');
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.new_password.length < 8) {
      alert('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoadingPassword(true);

    try {
      await authService.changePassword(
        passwordData.old_password,
        passwordData.new_password,
        passwordData.new_password_confirm
      );
      alert('✅ Contraseña cambiada exitosamente');
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      const errorMsg = error.response?.data;
      if (typeof errorMsg === 'object') {
        const firstError = Object.values(errorMsg)[0];
        alert(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        alert('Error al cambiar contraseña. Verifica tu contraseña actual.');
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  const cancelarEdicion = () => {
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      telefono: user?.telefono || '',
      fecha_nacimiento: user?.fecha_nacimiento || '',
      direccion: user?.direccion || '',
    });
    setEditando(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/paciente')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-sm text-gray-600">Gestiona tu información personal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del Usuario */}
        <div className="card mb-6 bg-gradient-to-r from-primary-50 to-indigo-50 border-2 border-primary-200">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.nombre} {user?.apellido}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm bg-primary-100 text-primary-800 px-3 py-1 rounded-full font-medium">
                  {user?.rol}
                </span>
                {user?.bloqueado ? (
                  <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                    🔒 Bloqueado
                  </span>
                ) : (
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    ✅ Activo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('datos')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition ${
                  activeTab === 'datos'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Datos Personales
              </button>
              <button
                onClick={() => setActiveTab('seguridad')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition ${
                  activeTab === 'seguridad'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔒 Seguridad
              </button>
              <button
                onClick={() => setActiveTab('estadisticas')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition ${
                  activeTab === 'estadisticas'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Estadísticas
              </button>
            </nav>
          </div>
        </div>

        {/* Tab: Datos Personales */}
        {activeTab === 'datos' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Información Personal</h2>
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="btn btn-primary"
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            <form onSubmit={handleUpdatePerfil}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUT
                  </label>
                  <input
                    type="text"
                    value={user?.rut || ''}
                    disabled
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">El RUT no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className={`input ${!editando ? 'bg-gray-50' : ''}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className={`input ${!editando ? 'bg-gray-50' : ''}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className={`input ${!editando ? 'bg-gray-50' : ''}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    disabled={!editando}
                    className={`input ${!editando ? 'bg-gray-50' : ''}`}
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={!editando}
                  className={`input ${!editando ? 'bg-gray-50' : ''}`}
                  rows="3"
                  required
                />
              </div>

              {editando && (
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="btn btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="btn btn-primary flex-1 disabled:opacity-50"
                  >
                    {loadingUpdate ? 'Guardando...' : '✓ Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab: Seguridad */}
        {activeTab === 'seguridad' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>

            <form onSubmit={handleChangePassword} className="max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual *
                  </label>
                  <input
                    type="password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="input"
                    minLength="8"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    name="new_password_confirm"
                    value={passwordData.new_password_confirm}
                    onChange={handlePasswordChange}
                    className="input"
                    minLength="8"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="btn btn-primary w-full mt-6 disabled:opacity-50"
              >
                {loadingPassword ? 'Cambiando...' : '🔒 Cambiar Contraseña'}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Estadísticas */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen de Cuenta</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Inasistencias</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {user?.contador_inasistencias || 0}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Estado</p>
                  <p className="text-xl font-bold text-green-900 mt-2">
                    {user?.bloqueado ? '🔒 Bloqueado' : '✅ Activo'}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Miembro desde</p>
                  <p className="text-lg font-bold text-purple-900 mt-2">
                    {new Date(user?.date_joined).toLocaleDateString('es-CL', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {user?.bloqueado && (
              <div className="card bg-red-50 border-2 border-red-200">
                <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Usuario Bloqueado</h3>
                <p className="text-red-700 mb-2">
                  <strong>Motivo:</strong> {user?.motivo_bloqueo || 'No especificado'}
                </p>
                {user?.fecha_bloqueo && (
                  <p className="text-sm text-red-600">
                    Bloqueado el: {new Date(user.fecha_bloqueo).toLocaleDateString('es-CL')}
                  </p>
                )}
                <p className="text-sm text-red-600 mt-3">
                  Contacta con el administrador para desbloquear tu cuenta.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}