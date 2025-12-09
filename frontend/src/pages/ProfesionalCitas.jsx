import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axios';

export default function ProfesionalCitas() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODAS');
  const [fechaFiltro, setFechaFiltro] = useState('');

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
      AGENDADA: 'badge badge-info',
      CONFIRMADA: 'badge badge-success',
      COMPLETADA: 'badge',
      CANCELADA: 'badge badge-danger',
      NO_ASISTIO: 'badge badge-warning',
    };
    return badges[estado] || 'badge';
  };

  const citasFiltradas = citas.filter(cita => {
    if (filtro === 'TODAS') return true;
    if (filtro === 'PENDIENTES') return ['AGENDADA', 'CONFIRMADA'].includes(cita.estado);
    return cita.estado === filtro;
  });

  const formatFecha = (fechaHora) => {
    return new Date(fechaHora).toLocaleDateString('es-CL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
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
                onClick={() => navigate('/profesional')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
                <p className="text-sm text-gray-600">Gestiona tus consultas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por estado
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltro('TODAS')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filtro === 'TODAS'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFiltro('PENDIENTES')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filtro === 'PENDIENTES'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFiltro('COMPLETADA')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filtro === 'COMPLETADA'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completadas
                </button>
                <button
                  onClick={() => setFiltro('CANCELADA')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filtro === 'CANCELADA'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Canceladas
                </button>
              </div>
            </div>
          </div>

          {fechaFiltro && (
            <div className="mt-4">
              <button
                onClick={() => setFechaFiltro('')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                ✕ Limpiar filtro de fecha
              </button>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{citas.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {citas.filter(c => ['AGENDADA', 'CONFIRMADA'].includes(c.estado)).length}
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {citas.filter(c => c.estado === 'COMPLETADA').length}
              </p>
              <p className="text-sm text-gray-600">Completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {citas.filter(c => c.estado === 'CANCELADA').length}
              </p>
              <p className="text-sm text-gray-600">Canceladas</p>
            </div>
          </div>
        </div>

        {/* Lista de Citas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando citas...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 mb-4">
              No hay citas {filtro !== 'TODAS' && `en estado: ${filtro}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {citasFiltradas.map((cita) => (
              <div
                key={cita.id}
                onClick={() => navigate(`/profesional/cita/${cita.id}`)}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-lg font-bold text-primary-600">
                        {formatHora(cita.fecha_hora)}
                      </span>
                      <span className={getEstadoBadge(cita.estado)}>
                        {cita.estado_display || cita.estado}
                      </span>
                      {cita.confirmada_por_paciente && (
                        <span className="badge badge-success text-xs">
                          ✓ Confirmada
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Paciente</p>
                        <p className="font-semibold text-gray-900">
                          {cita.paciente_nombre}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Fecha</p>
                        <p className="font-semibold text-gray-900">
                          {formatFecha(cita.fecha_hora)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Motivo de consulta</p>
                      <p className="text-gray-800">{cita.motivo_consulta}</p>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mt-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duración: {cita.duracion_minutos} minutos
                    </div>
                  </div>

                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}