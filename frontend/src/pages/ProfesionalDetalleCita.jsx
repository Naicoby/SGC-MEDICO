import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { citasService } from '../api/citasService';
import axiosInstance from '../api/axios';

export default function ProfesionalDetalleCita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [notasProfesional, setNotasProfesional] = useState('');
  const [editandoNotas, setEditandoNotas] = useState(false);

  useEffect(() => {
    fetchCita();
  }, [id]);

  const fetchCita = async () => {
    try {
      const response = await citasService.getCitaById(id);
      setCita(response);
      setNotasProfesional(response.notas_profesional || '');
    } catch (error) {
      console.error('Error al cargar cita:', error);
      alert('Error al cargar la cita');
      navigate('/profesional/mis-citas');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletarCita = async () => {
    if (!window.confirm('¿Marcar esta cita como completada?')) return;

    setLoadingAction(true);
    try {
      await axiosInstance.post(`/citas/${id}/completar/`, {
        notas_profesional: notasProfesional,
      });
      alert('✅ Cita marcada como completada');
      fetchCita();
    } catch (error) {
      console.error('Error al completar cita:', error);
      alert('Error al completar la cita');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleMarcarNoAsistio = async () => {
    if (!window.confirm('¿Marcar como "No Asistió"? Esto sumará una inasistencia al paciente.')) return;

    setLoadingAction(true);
    try {
      await axiosInstance.post(`/citas/${id}/marcar_no_asistio/`);
      alert('✅ Marcado como "No Asistió"');
      fetchCita();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al marcar inasistencia');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGuardarNotas = async () => {
    setLoadingAction(true);
    try {
      await axiosInstance.patch(`/citas/${id}/`, {
        notas_profesional: notasProfesional,
      });
      alert('✅ Notas guardadas exitosamente');
      setEditandoNotas(false);
      fetchCita();
    } catch (error) {
      console.error('Error al guardar notas:', error);
      alert('Error al guardar notas');
    } finally {
      setLoadingAction(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      AGENDADA: { class: 'badge-info', icon: '📅', text: 'Agendada' },
      CONFIRMADA: { class: 'badge-success', icon: '✅', text: 'Confirmada' },
      COMPLETADA: { class: 'badge', icon: '✓', text: 'Completada' },
      CANCELADA: { class: 'badge-danger', icon: '❌', text: 'Cancelada' },
      NO_ASISTIO: { class: 'badge-warning', icon: '⚠️', text: 'No Asistió' },
    };
    return badges[estado] || { class: 'badge', icon: '•', text: estado };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cita...</p>
        </div>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cita no encontrada</h2>
          <button onClick={() => navigate('/profesional/mis-citas')} className="btn btn-primary">
            Volver a Mis Citas
          </button>
        </div>
      </div>
    );
  }

  const estadoInfo = getEstadoBadge(cita.estado);
  const puedeCompletar = ['AGENDADA', 'CONFIRMADA'].includes(cita.estado);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profesional/mis-citas')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalle de Cita</h1>
              <p className="text-sm text-gray-600">ID: #{cita.id}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estado */}
        <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{estadoInfo.icon}</div>
              <div>
                <p className="text-sm text-gray-600">Estado actual</p>
                <p className="text-2xl font-bold text-gray-800">{estadoInfo.text}</p>
              </div>
            </div>
            {cita.confirmada_por_paciente && (
              <span className="badge badge-success text-sm px-4 py-2">
                ✓ Confirmada por paciente
              </span>
            )}
          </div>
        </div>

        {/* Información del Paciente */}
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Información del Paciente
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {cita.paciente_nombre}
            </p>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Fecha y Hora
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Fecha</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(cita.fecha_hora).toLocaleDateString('es-CL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Hora</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(cita.fecha_hora).toLocaleTimeString('es-CL', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' '}
                ({cita.duracion_minutos} min)
              </p>
            </div>
          </div>
        </div>

        {/* Motivo de Consulta */}
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Motivo de Consulta
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800">{cita.motivo_consulta}</p>
          </div>
        </div>

        {/* Notas del Profesional */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notas del Profesional
            </h2>
            {!editandoNotas && cita.estado !== 'CANCELADA' && (
              <button
                onClick={() => setEditandoNotas(true)}
                className="btn btn-secondary text-sm"
              >
                ✏️ Editar
              </button>
            )}
          </div>

          {editandoNotas ? (
            <div>
              <textarea
                value={notasProfesional}
                onChange={(e) => setNotasProfesional(e.target.value)}
                className="input"
                rows="6"
                placeholder="Escribe aquí las notas de la consulta, diagnóstico, tratamiento, etc..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setNotasProfesional(cita.notas_profesional || '');
                    setEditandoNotas(false);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarNotas}
                  disabled={loadingAction}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  {loadingAction ? 'Guardando...' : '💾 Guardar Notas'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              {notasProfesional ? (
                <p className="text-gray-800 whitespace-pre-wrap">{notasProfesional}</p>
              ) : (
                <p className="text-gray-500 italic">No hay notas registradas aún</p>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        {puedeCompletar && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCompletarCita}
              disabled={loadingAction}
              className="btn btn-primary flex-1 py-3 disabled:opacity-50"
            >
              {loadingAction ? 'Procesando...' : '✓ Marcar como Completada'}
            </button>
            
            <button
              onClick={handleMarcarNoAsistio}
              disabled={loadingAction}
              className="btn btn-danger flex-1 py-3 disabled:opacity-50"
            >
              ⚠️ Marcar "No Asistió"
            </button>
          </div>
        )}

        {cita.estado === 'COMPLETADA' && (
          <div className="card bg-green-50 border-2 border-green-200 text-center py-4">
            <p className="text-green-800 font-semibold">✅ Consulta completada</p>
          </div>
        )}

        {cita.estado === 'CANCELADA' && (
          <div className="card bg-red-50 border-2 border-red-200">
            <h3 className="text-lg font-bold text-red-800 mb-3">❌ Cita Cancelada</h3>
            {cita.motivo_cancelacion && (
              <p className="text-red-700">
                <strong>Motivo:</strong> {cita.motivo_cancelacion}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}