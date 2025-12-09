import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axios';

export default function PacienteDashboard() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [proximasCitas, setProximasCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProximasCitas();
  }, []);

  const fetchProximasCitas = async () => {
    try {
      const response = await axiosInstance.get('/citas/mis_proximas_citas/');
      setProximasCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
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
      COMPLETADA: 'badge badge-secondary',
      CANCELADA: 'badge badge-danger',
    };
    return badges[estado] || 'badge';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenido, {user?.nombre}
              </h1>
              <p className="text-sm text-gray-600">Panel de Paciente</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Próximas Citas</p>
                <p className="text-3xl font-bold mt-2">{proximasCitas.length}</p>
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
                <p className="text-green-100">Estado</p>
                <p className="text-xl font-bold mt-2">
                  {user?.bloqueado ? '🔒 Bloqueado' : '✅ Activo'}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Inasistencias</p>
                <p className="text-3xl font-bold mt-2">{user?.contador_inasistencias || 0}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/paciente/nueva-cita')}
            className="card hover:shadow-lg transition-shadow cursor-pointer bg-primary-50 border-2 border-primary-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-500 text-white rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Agendar Cita</p>
                <p className="text-sm text-gray-600">Reservar nueva cita</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/paciente/mis-citas')}
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
                <p className="text-sm text-gray-600">Ver todas mis citas</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/paciente/perfil')}
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

        {/* Próximas Citas */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Próximas Citas</h2>
          
          {loading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : proximasCitas.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">No tienes citas próximas</p>
              <button
                onClick={() => navigate('/paciente/nueva-cita')}
                className="btn btn-primary mt-4"
              >
                Agendar Primera Cita
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {proximasCitas.map((cita) => (
                <div
                  key={cita.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={getEstadoBadge(cita.estado)}>
                          {cita.estado_display}
                        </span>
                        {cita.confirmada_por_paciente && (
                          <span className="badge badge-success">✓ Confirmada</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800 mb-1">
                        {cita.profesional_nombre}
                      </p>
                      <p className="text-sm text-gray-600">{cita.especialidad}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        📅 {new Date(cita.fecha_hora).toLocaleDateString('es-CL', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/paciente/cita/${cita.id}`)}
                      className="btn btn-secondary text-sm"
                    >
                      Ver Detalles
                    </button>
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