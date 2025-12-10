import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    total_usuarios: 0,
    total_pacientes: 0,
    total_profesionales: 0,
    usuarios_bloqueados: 0,
    total_citas: 0,
    citas_hoy: 0,
    citas_pendientes: 0,
    citas_completadas: 0,
    tasa_inasistencia: 0,
  });

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    try {
      // Obtener estadísticas de citas
      const responseCitas = await axiosInstance.get('/citas/estadisticas/');
      
      // Obtener todos los usuarios para contar
      const responseUsuarios = await axiosInstance.get('/usuarios/');
      const usuarios = responseUsuarios.data.results || responseUsuarios.data;
      
      // Obtener profesionales
      const responseProfesionales = await axiosInstance.get('/profesionales/');
      const profesionales = responseProfesionales.data.results || responseProfesionales.data;
      
      setEstadisticas({
        total_usuarios: usuarios.length,
        total_pacientes: usuarios.filter(u => u.rol === 'PACIENTE').length,
        total_profesionales: profesionales.length,
        usuarios_bloqueados: usuarios.filter(u => u.bloqueado).length,
        total_citas: responseCitas.data.total_citas || 0,
        citas_pendientes: (responseCitas.data.citas_agendadas || 0) + (responseCitas.data.citas_confirmadas || 0),
        citas_completadas: responseCitas.data.citas_completadas || 0,
        tasa_inasistencia: responseCitas.data.tasa_inasistencia || 0,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Panel de Administración
              </h1>
              <p className="text-purple-100 mt-1">
                Bienvenido, {user?.nombre} {user?.apellido}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Usuarios */}
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Usuarios</p>
                    <p className="text-4xl font-bold mt-2">{estadisticas.total_usuarios}</p>
                    <p className="text-blue-100 text-xs mt-1">
                      {estadisticas.total_pacientes} pacientes
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Profesionales */}
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Profesionales</p>
                    <p className="text-4xl font-bold mt-2">{estadisticas.total_profesionales}</p>
                    <p className="text-green-100 text-xs mt-1">Activos</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Citas */}
              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Citas</p>
                    <p className="text-4xl font-bold mt-2">{estadisticas.total_citas}</p>
                    <p className="text-purple-100 text-xs mt-1">
                      {estadisticas.citas_pendientes} pendientes
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tasa de Inasistencia */}
              <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Inasistencias</p>
                    <p className="text-4xl font-bold mt-2">{estadisticas.tasa_inasistencia}%</p>
                    <p className="text-red-100 text-xs mt-1">
                      {estadisticas.usuarios_bloqueados} bloqueados
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => navigate('/admin/usuarios')}
                className="card hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-4 group-hover:bg-blue-600 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-lg">Gestionar Usuarios</p>
                    <p className="text-sm text-gray-600">Ver y administrar usuarios</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/profesionales')}
                className="card hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 text-green-600 rounded-full p-4 group-hover:bg-green-600 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-lg">Profesionales</p>
                    <p className="text-sm text-gray-600">Gestionar profesionales</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/citas')}
                className="card hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 text-purple-600 rounded-full p-4 group-hover:bg-purple-600 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-lg">Todas las Citas</p>
                    <p className="text-sm text-gray-600">Ver y gestionar citas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/reportes')}
                className="card hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 text-yellow-600 rounded-full p-4 group-hover:bg-yellow-600 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-lg">Reportes</p>
                    <p className="text-sm text-gray-600">Estadísticas detalladas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/configuracion')}
                className="card hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 text-gray-600 rounded-full p-4 group-hover:bg-gray-600 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-lg">Configuración</p>
                    <p className="text-sm text-gray-600">Ajustes del sistema</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/perfil')}
                className="card hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-lg">Mi Perfil</p>
                    <p className="text-sm text-gray-600">Editar información</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Resumen Reciente */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usuarios Bloqueados */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4">⚠️ Atención Requerida</h2>
                <div className="space-y-3">
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-red-900">Usuarios Bloqueados</p>
                        <p className="text-sm text-red-700 mt-1">
                          {estadisticas.usuarios_bloqueados} usuario(s) bloqueado(s)
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/admin/usuarios?filtro=bloqueados')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-yellow-900">Tasa de Inasistencia</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          {estadisticas.tasa_inasistencia}% de inasistencias
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/admin/reportes')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                      >
                        Ver Reporte
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Citas Completadas */}
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Resumen de Citas</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completadas</p>
                        <p className="text-xl font-bold text-gray-900">{estadisticas.citas_completadas}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pendientes</p>
                        <p className="text-xl font-bold text-gray-900">{estadisticas.citas_pendientes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}