import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axios';

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para desbloqueo
  const [showDesbloqueoModal, setShowDesbloqueoModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [motivoDesbloqueo, setMotivoDesbloqueo] = useState('');
  
  // Estados para bloqueo
  const [showBloqueoModal, setShowBloqueoModal] = useState(false);
  const [usuarioABloquear, setUsuarioABloquear] = useState(null);
  const [motivoBloqueo, setMotivoBloqueo] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axiosInstance.get('/usuarios/');
      setUsuarios(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesbloquear = async () => {
    if (!motivoDesbloqueo.trim()) {
      alert('Debes ingresar un motivo para el desbloqueo');
      return;
    }

    try {
      await axiosInstance.post(`/usuarios/${usuarioSeleccionado.id}/desbloquear/`, {
        motivo: motivoDesbloqueo,
      });
      alert('✅ Usuario desbloqueado exitosamente');
      setShowDesbloqueoModal(false);
      setUsuarioSeleccionado(null);
      setMotivoDesbloqueo('');
      fetchUsuarios();
    } catch (error) {
      console.error('Error al desbloquear:', error);
      alert('Error al desbloquear usuario');
    }
  };

  const handleBloquear = async () => {
    if (!motivoBloqueo.trim()) {
      alert('Debes ingresar un motivo para el bloqueo');
      return;
    }

    try {
      await axiosInstance.post(`/usuarios/${usuarioABloquear.id}/bloquear/`, {
        motivo: motivoBloqueo,
      });
      alert('✅ Usuario bloqueado exitosamente');
      setShowBloqueoModal(false);
      setUsuarioABloquear(null);
      setMotivoBloqueo('');
      fetchUsuarios();
    } catch (error) {
      console.error('Error al bloquear:', error);
      alert('Error al bloquear usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    // Filtro por estado
    if (filtro === 'BLOQUEADOS' && !usuario.bloqueado) return false;
    if (filtro === 'ACTIVOS' && usuario.bloqueado) return false;
    if (filtro === 'PACIENTES' && usuario.rol !== 'PACIENTE') return false;
    if (filtro === 'PROFESIONALES' && usuario.rol !== 'PROFESIONAL') return false;
    if (filtro === 'ADMINS' && usuario.rol !== 'ADMIN') return false;

    // Filtro por búsqueda
    if (busqueda) {
      const searchLower = busqueda.toLowerCase();
      return (
        usuario.nombre?.toLowerCase().includes(searchLower) ||
        usuario.apellido?.toLowerCase().includes(searchLower) ||
        usuario.rut?.toLowerCase().includes(searchLower) ||
        usuario.email?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const getRolBadge = (rol) => {
    const badges = {
      PACIENTE: 'bg-blue-100 text-blue-800',
      PROFESIONAL: 'bg-green-100 text-green-800',
      ADMIN: 'bg-purple-100 text-purple-800',
    };
    return badges[rol] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="text-sm text-gray-600">Administrar usuarios del sistema</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar usuario
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, RUT o email..."
                className="input"
              />
            </div>

            {/* Estadísticas rápidas */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {usuarios.filter(u => u.rol === 'PACIENTE').length}
                </p>
                <p className="text-xs text-gray-600">Pacientes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {usuarios.filter(u => u.rol === 'PROFESIONAL').length}
                </p>
                <p className="text-xs text-gray-600">Profesionales</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {usuarios.filter(u => u.bloqueado).length}
                </p>
                <p className="text-xs text-gray-600">Bloqueados</p>
              </div>
            </div>
          </div>

          {/* Filtros por categoría */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltro('TODOS')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'TODOS'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({usuarios.length})
            </button>
            <button
              onClick={() => setFiltro('ACTIVOS')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'ACTIVOS'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activos ({usuarios.filter(u => !u.bloqueado).length})
            </button>
            <button
              onClick={() => setFiltro('BLOQUEADOS')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'BLOQUEADOS'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bloqueados ({usuarios.filter(u => u.bloqueado).length})
            </button>
            <button
              onClick={() => setFiltro('PACIENTES')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'PACIENTES'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pacientes
            </button>
            <button
              onClick={() => setFiltro('PROFESIONALES')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'PROFESIONALES'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Profesionales
            </button>
            <button
              onClick={() => setFiltro('ADMINS')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'ADMINS'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Administradores
            </button>
          </div>
        </div>

        {/* Lista de Usuarios */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-600">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RUT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inasistencias
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-600 font-semibold">
                                {usuario.nombre?.charAt(0)}{usuario.apellido?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nombre} {usuario.apellido}
                            </div>
                            <div className="text-sm text-gray-500">{usuario.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usuario.rut}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRolBadge(usuario.rol)}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {usuario.bloqueado ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            🔒 Bloqueado
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ✓ Activo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {usuario.contador_inasistencias || 0}
                          {usuario.contador_inasistencias >= 3 && (
                            <span className="ml-2 text-red-600">⚠️</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {usuario.bloqueado ? (
                            <button
                              onClick={() => {
                                setUsuarioSeleccionado(usuario);
                                setShowDesbloqueoModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Desbloquear usuario"
                            >
                              🔓
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setUsuarioABloquear(usuario);
                                setShowBloqueoModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Bloquear usuario"
                            >
                              🔒
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/admin/usuario/${usuario.id}`)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Ver detalles"
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Desbloqueo */}
      {showDesbloqueoModal && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Desbloquear Usuario
            </h3>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Usuario:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                <strong>Inasistencias:</strong> {usuarioSeleccionado.contador_inasistencias}
              </p>
              {usuarioSeleccionado.motivo_bloqueo && (
                <p className="text-sm text-yellow-800 mt-1">
                  <strong>Motivo del bloqueo:</strong> {usuarioSeleccionado.motivo_bloqueo}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del desbloqueo *
              </label>
              <textarea
                value={motivoDesbloqueo}
                onChange={(e) => setMotivoDesbloqueo(e.target.value)}
                className="input"
                rows="4"
                placeholder="Explica el motivo por el cual se desbloquea al usuario..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDesbloqueoModal(false);
                  setUsuarioSeleccionado(null);
                  setMotivoDesbloqueo('');
                }}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDesbloquear}
                disabled={!motivoDesbloqueo.trim()}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                🔓 Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Bloqueo */}
      {showBloqueoModal && usuarioABloquear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Bloquear Usuario
            </h3>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ Advertencia:</strong> El usuario no podrá agendar nuevas citas hasta ser desbloqueado.
              </p>
              <p className="text-sm text-red-800 mt-2">
                <strong>Usuario:</strong> {usuarioABloquear.nombre} {usuarioABloquear.apellido}
              </p>
              <p className="text-sm text-red-800 mt-1">
                <strong>RUT:</strong> {usuarioABloquear.rut}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del bloqueo *
              </label>
              <textarea
                value={motivoBloqueo}
                onChange={(e) => setMotivoBloqueo(e.target.value)}
                className="input"
                rows="4"
                placeholder="Explica el motivo por el cual se bloquea al usuario..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBloqueoModal(false);
                  setUsuarioABloquear(null);
                  setMotivoBloqueo('');
                }}
                className="btn btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleBloquear}
                disabled={!motivoBloqueo.trim()}
                className="btn btn-danger flex-1 disabled:opacity-50"
              >
                🔒 Bloquear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}