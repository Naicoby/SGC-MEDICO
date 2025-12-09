import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axios';

export default function ProfesionalDashboard() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  
  const [citasHoy, setCitasHoy] = useState([]);
  const [proximasCitas, setProximasCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    total_hoy: 0,
    completadas_hoy: 0,
    pendientes_hoy: 0,
    total_semana: 0,
  });

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      // Obtener citas del día
      const hoy = new Date().toISOString().split('T')[0];
      const responseCitasHoy = await axiosInstance.get('/citas/', {
        params: { fecha: hoy }
      });
      
      setCitasHoy(responseCitasHoy.data.results || responseCitasHoy.data);
      
      // Calcular estadísticas
      const citas = responseCitasHoy.data.results || responseCitasHoy.data;
      setEstadisticas({
        total_hoy: citas.length,
        completadas_hoy: citas.filter(c => c.estado === 'COMPLETADA').length,
        pendientes_hoy: citas.filter(c => ['AGENDADA', 'CONFIRMADA'].includes(c.estado)).length,
        total_semana: citas.length, // Simplificado por ahora
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      AGENDADA: 'badge badge-info',
      CONFIRMADA: 'badge badge-success',
      COMPLETADA: 'badge badge',
      CANCELADA: 'badge badge-danger',
      NO_ASISTIO: 'badge badge-warning',
    };
    return badges[estado] || 'badge';
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenido, Dr(a). {user?.nombre} {user?.apellido}
              </h1>
              <p className="text-sm text-gray-600">Panel de Profesional</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Citas Hoy</p>
                <p className="text-3xl font-bold mt-2">{estadisticas.total_hoy}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completadas</p>
                <p className="text-3xl font-bold mt-2">{estadisticas.completadas_hoy}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Pendientes</p>
                <p className="text-3xl font-bold mt-2">{estadisticas.pendientes_hoy}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Esta Semana</p>
                <p className="text-3xl font-bold mt-2">{estadisticas.total_semana}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/profesional/mis-citas')}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Mis Citas</p>
                <p className="text-sm text-gray-600">Ver todas las citas</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/profesional/disponibilidad')}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Disponibilidad</p>
                <p className="text-sm text-gray-600">Configurar horarios</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/profesional/perfil')}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gray-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Mi Perfil</p>
                <p className="text-sm text-gray-600">Editar información</p>
              </div>
            </div>
          </button>
        </div>

        {/* Agenda del Día */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Agenda de Hoy</h2>
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando agenda...</p>
            </div>
          ) : citasHoy.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">No tienes citas programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {citasHoy.map((cita) => (
                <div
                  key={cita.id}
                  onClick={() => navigate(`/profesional/cita/${cita.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-primary-600">
                          {formatHora(cita.fecha_hora)}
                        </span>
                        <span className={getEstadoBadge(cita.estado)}>
                          {cita.estado_display || cita.estado}
                        </span>
                      </div>
                      
                      <p className="font-semibold text-gray-900 mb-1">
                        {cita.paciente_nombre}
                      </p>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {cita.motivo_consulta}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Duración: {cita.duracion_minutos} min
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
        </div>
      </main>
    </div>
  );
}