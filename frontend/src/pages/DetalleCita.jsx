import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { citasService } from '../api/citasService';

export default function DetalleCita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchCita();
  }, [id]);

  const fetchCita = async () => {
    try {
      const response = await citasService.getCitaById(id);
      setCita(response);
    } catch (error) {
      console.error('Error al cargar cita:', error);
      alert('Error al cargar la cita');
      navigate('/paciente/mis-citas');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!window.confirm('¿Confirmas tu asistencia a esta cita?')) return;

    setLoadingAction(true);
    try {
      await citasService.confirmarCita(id);
      alert('✅ Cita confirmada exitosamente');
      fetchCita(); // Recargar datos
    } catch (error) {
      console.error('Error al confirmar:', error);
      alert('Error al confirmar la cita');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancelar = async () => {
    if (!motivoCancelacion.trim()) {
      alert('Debes ingresar un motivo de cancelación');
      return;
    }

    setLoadingAction(true);
    try {
      await citasService.cancelarCita(id, motivoCancelacion);
      alert('✅ Cita cancelada exitosamente');
      setShowCancelModal(false);
      fetchCita(); // Recargar datos
    } catch (error) {
      console.error('Error al cancelar:', error);
      const errorMsg = error.response?.data?.detail || 'Error al cancelar la cita';
      alert(errorMsg);
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
          <button onClick={() => navigate('/paciente/mis-citas')} className="btn btn-primary">
            Volver a Mis Citas
          </button>
        </div>
      </div>
    );
  }

  const estadoInfo = getEstadoBadge(cita.estado);
  const puedeConfirmar = cita.estado === 'AGENDADA' && !cita.confirmada_por_paciente;
  const puedeCancelar = cita.puede_cancelar && ['AGENDADA', 'CONFIRMADA'].includes(cita.estado);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/paciente/mis-citas')}
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
                ✓ Confirmada por ti
              </span>
            )}
          </div>
        </div>

        {/* Información del Profesional */}
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profesional
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {cita.profesional_detalle?.nombre_completo || cita.profesional_nombre}
            </p>
            <p className="text-gray-600">
              {cita.profesional_detalle?.especialidad || 'Especialidad no especificada'}
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
                ({cita.duracion_minutos} minutos)
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

        {/* Observaciones (si existen) */}
        {cita.observaciones && (
          <div className="card mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Observaciones</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-gray-800">{cita.observaciones}</p>
            </div>
          </div>
        )}

        {/* Información de Cancelación */}
        {cita.estado === 'CANCELADA' && cita.motivo_cancelacion && (
          <div className="card mb-6 border-2 border-red-200">
            <h2 className="text-lg font-bold text-red-800 mb-4">Motivo de Cancelación</h2>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-gray-800 mb-2">{cita.motivo_cancelacion}</p>
              <p className="text-sm text-gray-600">
                Cancelada el: {new Date(cita.fecha_cancelacion).toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          {puedeConfirmar && (
            <button
              onClick={handleConfirmar}
              disabled={loadingAction}
              className="btn btn-primary flex-1 py-3 disabled:opacity-50"
            >
              {loadingAction ? 'Confirmando...' : '✓ Confirmar Asistencia'}
            </button>
          )}
          
          {puedeCancelar && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={loadingAction}
              className="btn btn-danger flex-1 py-3 disabled:opacity-50"
            >
              ❌ Cancelar Cita
            </button>
          )}

          {!puedeConfirmar && !puedeCancelar && (
            <div className="card bg-gray-50 text-center py-4">
              <p className="text-gray-600">
                {cita.estado === 'COMPLETADA' && '✅ Esta cita ya fue completada'}
                {cita.estado === 'CANCELADA' && '❌ Esta cita está cancelada'}
                {cita.estado === 'NO_ASISTIO' && '⚠️ Registrada como inasistencia'}
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Cita creada el: {new Date(cita.fecha_creacion).toLocaleString('es-CL')}</p>
          {cita.recordatorio_enviado && (
            <p className="mt-1">📧 Recordatorio enviado</p>
          )}
        </div>
      </main>

      {/* Modal de Cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cancelar Cita
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Solo puedes cancelar con al menos 24 horas de anticipación
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de cancelación *
              </label>
              <textarea
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="input"
                rows="4"
                placeholder="Explica brevemente por qué cancelas esta cita..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setMotivoCancelacion('');
                }}
                disabled={loadingAction}
                className="btn btn-secondary flex-1"
              >
                Volver
              </button>
              <button
                onClick={handleCancelar}
                disabled={loadingAction || !motivoCancelacion.trim()}
                className="btn btn-danger flex-1 disabled:opacity-50"
              >
                {loadingAction ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}