import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function AdminReportes() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const [resCitas, resProfesionales, resUsuarios] = await Promise.all([
        axiosInstance.get('/citas/estadisticas/'),
        axiosInstance.get('/profesionales/'),
        axiosInstance.get('/usuarios/'),
      ]);

      setEstadisticas(resCitas.data);
      setProfesionales(resProfesionales.data.results || resProfesionales.data);
      setUsuarios(resUsuarios.data.results || resUsuarios.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const usuariosBloqueados = usuarios.filter(u => u.bloqueado);
  const pacientesConInasistencias = usuarios.filter(u => u.contador_inasistencias > 0 && u.rol === 'PACIENTE');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <h1 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
              <p className="text-sm text-gray-600">Análisis del sistema</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando reportes...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas Generales de Citas */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Estadísticas de Citas</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-4xl font-bold text-blue-600">{estadisticas?.total_citas || 0}</p>
                  <p className="text-sm text-gray-600 mt-2">Total de Citas</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-4xl font-bold text-green-600">{estadisticas?.citas_completadas || 0}</p>
                  <p className="text-sm text-gray-600 mt-2">Completadas</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-4xl font-bold text-yellow-600">{estadisticas?.citas_no_asistio || 0}</p>
                  <p className="text-sm text-gray-600 mt-2">No Asistió</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-4xl font-bold text-red-600">{estadisticas?.tasa_inasistencia || 0}%</p>
                  <p className="text-sm text-gray-600 mt-2">Tasa Inasistencia</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Agendadas</p>
                    <p className="text-xl font-bold text-gray-900">{estadisticas?.citas_agendadas || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Confirmadas</p>
                    <p className="text-xl font-bold text-gray-900">{estadisticas?.citas_confirmadas || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Canceladas</p>
                    <p className="text-xl font-bold text-gray-900">{estadisticas?.citas_canceladas || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profesionales */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">👨‍⚕️ Profesionales Activos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profesionales.map((prof) => (
                  <div key={prof.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 rounded-full p-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{prof.nombre_completo}</p>
                        <p className="text-sm text-gray-600">{prof.especialidad}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {prof.duracion_cita_minutos} min por cita
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usuarios con Inasistencias */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usuarios Bloqueados */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔒 Usuarios Bloqueados</h2>
                
                {usuariosBloqueados.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No hay usuarios bloqueados</p>
                ) : (
                  <div className="space-y-3">
                    {usuariosBloqueados.map((usuario) => (
                      <div key={usuario.id} className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {usuario.nombre} {usuario.apellido}
                            </p>
                            <p className="text-sm text-gray-600">{usuario.rut}</p>
                            <p className="text-xs text-red-600 mt-1">
                              {usuario.contador_inasistencias} inasistencias
                            </p>
                          </div>
                          <button
                            onClick={() => navigate('/admin/usuarios?filtro=BLOQUEADOS')}
                            className="text-purple-600 hover:text-purple-700 text-sm"
                          >
                            Ver →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pacientes con Inasistencias */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ Pacientes con Inasistencias</h2>
                
                {pacientesConInasistencias.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No hay pacientes con inasistencias</p>
                ) : (
                  <div className="space-y-3">
                    {pacientesConInasistencias.slice(0, 5).map((usuario) => (
                      <div key={usuario.id} className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {usuario.nombre} {usuario.apellido}
                            </p>
                            <p className="text-sm text-gray-600">{usuario.rut}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-600">
                              {usuario.contador_inasistencias}
                            </p>
                            <p className="text-xs text-gray-600">inasistencias</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}