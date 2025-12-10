import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function AdminProfesionales() {
  const navigate = useNavigate();
  
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const response = await axiosInstance.get('/profesionales/');
      setProfesionales(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivo = async (prof) => {
    if (!window.confirm(`¿${prof.activo_para_citas ? 'Desactivar' : 'Activar'} a ${prof.nombre_completo}?`)) return;

    try {
      await axiosInstance.patch(`/profesionales/${prof.id}/`, {
        activo_para_citas: !prof.activo_para_citas,
      });
      alert(`✅ Profesional ${!prof.activo_para_citas ? 'activado' : 'desactivado'}`);
      fetchProfesionales();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar estado');
    }
  };

  const profesionalesFiltrados = profesionales.filter(prof => {
    if (!busqueda) return true;
    
    const searchLower = busqueda.toLowerCase();
    return (
      prof.nombre_completo?.toLowerCase().includes(searchLower) ||
      prof.especialidad?.toLowerCase().includes(searchLower) ||
      prof.usuario_nombre?.toLowerCase().includes(searchLower) ||
      prof.usuario_apellido?.toLowerCase().includes(searchLower)
    );
  });

  const profesionalesActivos = profesionales.filter(p => p.activo_para_citas);
  const profesionalesInactivos = profesionales.filter(p => !p.activo_para_citas);

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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesionales</h1>
                <p className="text-sm text-gray-600">Administrar profesionales de la salud</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card text-center">
            <p className="text-4xl font-bold text-gray-900">{profesionales.length}</p>
            <p className="text-sm text-gray-600 mt-2">Total Profesionales</p>
          </div>
          <div className="card text-center">
            <p className="text-4xl font-bold text-green-600">{profesionalesActivos.length}</p>
            <p className="text-sm text-gray-600 mt-2">Activos</p>
          </div>
          <div className="card text-center">
            <p className="text-4xl font-bold text-red-600">{profesionalesInactivos.length}</p>
            <p className="text-sm text-gray-600 mt-2">Inactivos</p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="card mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar profesional
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, especialidad..."
            className="input"
          />
        </div>

        {/* Lista de Profesionales */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando profesionales...</p>
          </div>
        ) : profesionalesFiltrados.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600">No se encontraron profesionales</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profesionalesFiltrados.map((prof) => (
              <div
                key={prof.id}
                className={`card hover:shadow-lg transition-all ${
                  !prof.activo_para_citas ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full p-3 ${
                      prof.activo_para_citas ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-8 h-8 ${
                        prof.activo_para_citas ? 'text-green-600' : 'text-gray-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      {prof.activo_para_citas ? (
                        <span className="badge badge-success text-xs">✓ Activo</span>
                      ) : (
                        <span className="badge badge-danger text-xs">✗ Inactivo</span>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {prof.nombre_completo}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{prof.especialidad}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {prof.titulo_profesional && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      {prof.titulo_profesional}
                    </div>
                  )}
                  {prof.registro_profesional && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      Reg: {prof.registro_profesional}
                    </div>
                  )}
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {prof.duracion_cita_minutos} min por cita
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActivo(prof)}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      prof.activo_para_citas
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {prof.activo_para_citas ? '⏸ Desactivar' : '▶ Activar'}
                  </button>
                  <button
                    onClick={() => navigate(`/admin/profesional/${prof.id}`)}
                    className="flex-1 btn btn-secondary"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}