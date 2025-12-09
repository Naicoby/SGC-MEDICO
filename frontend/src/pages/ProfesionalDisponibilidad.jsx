import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../api/axios';

export default function ProfesionalDisponibilidad() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    dia_semana: '0',
    hora_inicio: '09:00',
    hora_fin: '17:00',
    activo: true,
  });

  const diasSemana = [
    { value: '0', label: 'Lunes' },
    { value: '1', label: 'Martes' },
    { value: '2', label: 'Miércoles' },
    { value: '3', label: 'Jueves' },
    { value: '4', label: 'Viernes' },
    { value: '5', label: 'Sábado' },
    { value: '6', label: 'Domingo' },
  ];

  useEffect(() => {
    fetchDisponibilidades();
  }, []);

  const fetchDisponibilidades = async () => {
    try {
      const response = await axiosInstance.get('/disponibilidad/');
      setDisponibilidades(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar disponibilidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editando) {
        await axiosInstance.put(`/disponibilidad/${editando.id}/`, formData);
        alert('✅ Disponibilidad actualizada');
      } else {
        await axiosInstance.post('/disponibilidad/', formData);
        alert('✅ Disponibilidad creada');
      }
      
      setShowModal(false);
      setEditando(null);
      resetForm();
      fetchDisponibilidades();
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.response?.data;
      if (typeof errorMsg === 'object') {
        const firstError = Object.values(errorMsg)[0];
        alert(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        alert('Error al guardar la disponibilidad');
      }
    }
  };

  const handleEditar = (disp) => {
    setEditando(disp);
    setFormData({
      dia_semana: disp.dia_semana.toString(),
      hora_inicio: disp.hora_inicio,
      hora_fin: disp.hora_fin,
      activo: disp.activo,
    });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta disponibilidad?')) return;
    
    try {
      await axiosInstance.delete(`/disponibilidad/${id}/`);
      alert('✅ Disponibilidad eliminada');
      fetchDisponibilidades();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    }
  };

  const handleToggleActivo = async (disp) => {
    try {
      await axiosInstance.patch(`/disponibilidad/${disp.id}/`, {
        activo: !disp.activo,
      });
      fetchDisponibilidades();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      dia_semana: '0',
      hora_inicio: '09:00',
      hora_fin: '17:00',
      activo: true,
    });
  };

  const getDiaLabel = (diaNumero) => {
    return diasSemana.find(d => d.value === diaNumero.toString())?.label || 'N/A';
  };

  const disponibilidadesPorDia = diasSemana.map(dia => ({
    dia: dia.label,
    horarios: disponibilidades.filter(d => d.dia_semana.toString() === dia.value),
  }));

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
                <h1 className="text-2xl font-bold text-gray-900">Mi Disponibilidad</h1>
                <p className="text-sm text-gray-600">Configura tus horarios de atención</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditando(null);
                resetForm();
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              ➕ Agregar Horario
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando disponibilidad...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {disponibilidadesPorDia.map((diaInfo) => (
              <div key={diaInfo.dia} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">{diaInfo.dia}</h2>
                  <span className="text-sm text-gray-600">
                    {diaInfo.horarios.length} horario(s)
                  </span>
                </div>

                {diaInfo.horarios.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">Sin disponibilidad configurada</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {diaInfo.horarios.map((horario) => (
                      <div
                        key={horario.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full font-semibold">
                            {horario.hora_inicio} - {horario.hora_fin}
                          </div>
                          <div>
                            {horario.activo ? (
                              <span className="badge badge-success">✓ Activo</span>
                            ) : (
                              <span className="badge badge-danger">✗ Inactivo</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActivo(horario)}
                            className="btn btn-secondary text-sm"
                            title={horario.activo ? 'Desactivar' : 'Activar'}
                          >
                            {horario.activo ? '⏸' : '▶'}
                          </button>
                          <button
                            onClick={() => handleEditar(horario)}
                            className="btn btn-secondary text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleEliminar(horario.id)}
                            className="btn btn-danger text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Información */}
        <div className="card bg-blue-50 border-2 border-blue-200 mt-8">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Información importante</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Los horarios configurados determinan cuándo los pacientes pueden agendar citas</li>
                <li>• Puedes desactivar temporalmente un horario sin eliminarlo</li>
                <li>• Los cambios se reflejan inmediatamente en el sistema de agendamiento</li>
                <li>• Evita solapamiento de horarios en el mismo día</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editando ? 'Editar Disponibilidad' : 'Agregar Disponibilidad'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Día de la semana *
                </label>
                <select
                  value={formData.dia_semana}
                  onChange={(e) => setFormData({...formData, dia_semana: e.target.value})}
                  className="input"
                  required
                >
                  {diasSemana.map(dia => (
                    <option key={dia.value} value={dia.value}>{dia.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora inicio *
                  </label>
                  <input
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora fin *
                  </label>
                  <input
                    type="time"
                    value={formData.hora_fin}
                    onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Horario activo
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditando(null);
                    resetForm();
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  {editando ? '💾 Guardar' : '➕ Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}