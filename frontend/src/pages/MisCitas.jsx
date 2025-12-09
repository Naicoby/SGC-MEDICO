import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { citasService } from '../api/citasService';

export default function MisCitas() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODAS');

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      const response = await citasService.getMisCitas();
      setCitas(response.results || response);
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
    return cita.estado === filtro;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
                <p className="text-sm text-gray-600">Historial completo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
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
              onClick={() => setFiltro('AGENDADA')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'AGENDADA'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Agendadas
            </button>
            <button
              onClick={() => setFiltro('CONFIRMADA')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'CONFIRMADA'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setFiltro('COMPLETADA')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === 'COMPLETADA'
                  ? 'bg-gray-600 text-white'
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
            <p className="text-gray-600 mb-4">No hay citas {filtro !== 'TODAS' && filtro.toLowerCase()}</p>
            <button
              onClick={() => navigate('/paciente/nueva-cita')}
              className="btn btn-primary"
            >
              Agendar Primera Cita
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {citasFiltradas.map((cita) => (
              <div
                key={cita.id}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/paciente/cita/${cita.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={getEstadoBadge(cita.estado)}>
                        {cita.estado_display || cita.estado}
                      </span>
                      {cita.confirmada_por_paciente && (
                        <span className="badge badge-success">✓ Confirmada</span>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {cita.profesional_nombre}
                    </h3>
                    <p className="text-gray-600 mb-2">{cita.especialidad}</p>

                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(cita.fecha_hora).toLocaleDateString('es-CL', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(cita.fecha_hora).toLocaleTimeString('es-CL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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