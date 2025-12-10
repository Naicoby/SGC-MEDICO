import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axios';

export default function AdminCitas() {
  const navigate = useNavigate();
  
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchCitas();
  }, [fechaFiltro]);

  const fetchCitas = async () => {
    try {
      const params = fechaFiltro ? { fecha: fechaFiltro } : {};
      const response = await axiosInstance.get('/citas/', { params });
      setCitas(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      AGENDADA: 'bg-blue-100 text-blue-800',
      CONFIRMADA: 'bg-green-100 text-green-800',
      COMPLETADA: 'bg-gray-100 text-gray-800',
      CANCELADA: 'bg-red-100 text-red-800',
      NO_ASISTIO: 'bg-yellow-100 text-yellow-800',
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const citasFiltradas = citas.filter(cita => {
    // Filtro por estado
    if (filtroEstado === 'PENDIENTES' && !['AGENDADA', 'CONFIRMADA'].includes(cita.estado)) return false;
    if (filtroEstado !== 'TODAS' && filtroEstado !== 'PENDIENTES' && cita.estado !== filtroEstado) return false;

    // Filtro por búsqueda
    if (busqueda) {
      const searchLower = busqueda.toLowerCase();
      return (
        cita.paciente_nombre?.toLowerCase().includes(searchLower) ||
        cita.profesional_nombre?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const estadisticas = {
    total: citas.length,
    pendientes: citas.filter(c => ['AGENDADA', 'CONFIRMADA'].includes(c.estado)).length,
    completadas: citas.filter(c => c.estado === 'COMPLETADA').length,
    canceladas: citas.filter(c => c.estado === 'CANCELADA').length,
    no_asistio: citas.filter(c => c.estado === 'NO_ASISTIO').length,
  };

  const formatFecha = (fechaHora) => {
    return new Date(fechaHora).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatHora = (fechaHora) => {
    return new Date(fechaHora).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas</h1>
                <p className="text-sm text-gray-600">Todas las citas del sistema</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="card text-center">
            <p className="text-3xl font-bold text-gray-900">{estadisticas.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-blue-600">{estadisticas.pendientes}</p>
            <p className="text-sm text-gray-600 mt-1">Pendientes</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-green-600">{estadisticas.completadas}</p>
            <p className="text-sm text-gray-600 mt-1">Completadas</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-red-600">{estadisticas.canceladas}</p>
            <p className="text-sm text-gray-600 mt-1">Canceladas</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-yellow-600">{estadisticas.no_asistio}</p>
            <p className="text-sm text-gray-600 mt-1">No Asistió</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Filtro por fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por fecha
              </label>
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="input"
              />
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por paciente o profesional..."
                className="input"
              />
            </div>
          </div>

          {/* Filtros por estado */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado('TODAS')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'TODAS'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({citas.length})
            </button>
            <button
              onClick={() => setFiltroEstado('PENDIENTES')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'PENDIENTES'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes ({estadisticas.pendientes})
            </button>
            <button
              onClick={() => setFiltroEstado('COMPLETADA')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'COMPLETADA'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completadas ({estadisticas.completadas})
            </button>
            <button
              onClick={() => setFiltroEstado('CANCELADA')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'CANCELADA'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Canceladas ({estadisticas.canceladas})
            </button>
            <button
              onClick={() => setFiltroEstado('NO_ASISTIO')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'NO_ASISTIO'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No Asistió ({estadisticas.no_asistio})
            </button>
          </div>

          {fechaFiltro && (
            <button
              onClick={() => setFechaFiltro('')}
              className="text-sm text-purple-600 hover:text-purple-700 mt-3"
            >
              ✕ Limpiar filtro de fecha
            </button>
          )}
        </div>

        {/* Lista de Citas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando citas...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">No hay citas para mostrar</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Profesional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{cita.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {cita.paciente_nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cita.profesional_nombre}</div>
                        <div className="text-sm text-gray-500">{cita.especialidad}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatFecha(cita.fecha_hora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatHora(cita.fecha_hora)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(cita.estado)}`}>
                          {cita.estado_display || cita.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/cita/${cita.id}`)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}