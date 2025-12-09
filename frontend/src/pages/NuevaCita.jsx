import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { profesionalesService } from '../api/profesionalesService';
import { citasService } from '../api/citasService';

export default function NuevaCita() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Estados
  const [paso, setPaso] = useState(1);
  const [profesionales, setProfesionales] = useState([]);
  const [loadingProfesionales, setLoadingProfesionales] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');

  // Cargar profesionales al inicio
  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const response = await profesionalesService.getProfesionales();
      setProfesionales(response.results || response);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
      alert('Error al cargar profesionales');
    } finally {
      setLoadingProfesionales(false);
    }
  };

  // Cargar horarios cuando se selecciona fecha
  useEffect(() => {
    if (fechaSeleccionada && profesionalSeleccionado) {
      fetchHorariosDisponibles();
    }
  }, [fechaSeleccionada]);

  const fetchHorariosDisponibles = async () => {
    setLoadingHorarios(true);
    setHorarioSeleccionado('');
    try {
      const response = await profesionalesService.getHorariosDisponibles(
        profesionalSeleccionado.id,
        fechaSeleccionada
      );
      setHorariosDisponibles(response.horarios || []);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setHorariosDisponibles([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const handleSelectProfesional = (prof) => {
    setProfesionalSeleccionado(prof);
    setPaso(2);
  };

  const handleSelectHorario = (hora) => {
    setHorarioSeleccionado(hora);
  };

  const handleContinuarPaso2 = () => {
    if (!fechaSeleccionada || !horarioSeleccionado) {
      alert('Debes seleccionar fecha y hora');
      return;
    }
    setPaso(3);
  };

  const handleCrearCita = async () => {
    if (!motivoConsulta.trim()) {
      alert('Debes ingresar un motivo de consulta');
      return;
    }

    setLoading(true);
    try {
      const fechaHora = `${fechaSeleccionada}T${horarioSeleccionado}:00`;
      
      const citaData = {
        profesional: profesionalSeleccionado.id,
        fecha_hora: fechaHora,
        duracion_minutos: profesionalSeleccionado.duracion_cita_minutos || 30,
        motivo_consulta: motivoConsulta,
      };

      await citasService.crearCita(citaData);
      alert('✅ Cita agendada exitosamente');
      navigate('/paciente/mis-citas');
    } catch (error) {
      console.error('Error al crear cita:', error);
      const errorMsg = error.response?.data;
      if (typeof errorMsg === 'object') {
        const firstError = Object.values(errorMsg)[0];
        alert(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        alert('Error al agendar cita. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const getFechaMinima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  // Obtener fecha máxima (3 meses adelante)
  const getFechaMaxima = () => {
    const hoy = new Date();
    hoy.setMonth(hoy.getMonth() + 3);
    return hoy.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (paso === 1) {
                    navigate('/paciente');
                  } else {
                    setPaso(paso - 1);
                  }
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agendar Nueva Cita</h1>
                <p className="text-sm text-gray-600">
                  Paso {paso} de 3
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  paso >= num
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    paso > num ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-600">Profesional</span>
          <span className="text-xs text-gray-600">Fecha y Hora</span>
          <span className="text-xs text-gray-600">Confirmar</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PASO 1: Seleccionar Profesional */}
        {paso === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Selecciona un Profesional
            </h2>

            {loadingProfesionales ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Cargando profesionales...</p>
              </div>
            ) : profesionales.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600">No hay profesionales disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profesionales.map((prof) => (
                  <div
                    key={prof.id}
                    onClick={() => handleSelectProfesional(prof)}
                    className="card hover:shadow-lg transition-shadow cursor-pointer hover:border-primary-500 border-2 border-transparent"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 rounded-full p-3">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {prof.nombre_completo}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{prof.especialidad}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {prof.duracion_cita_minutos} min por cita
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
        )}

        {/* PASO 2: Seleccionar Fecha y Hora */}
        {paso === 2 && (
          <div>
            <div className="card mb-6 bg-primary-50 border-2 border-primary-200">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-600 text-white rounded-full p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Profesional seleccionado</p>
                  <p className="font-semibold text-gray-900">
                    {profesionalSeleccionado?.nombre_completo}
                  </p>
                  <p className="text-sm text-gray-600">{profesionalSeleccionado?.especialidad}</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Selecciona Fecha y Hora
            </h2>

            <div className="card mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de la cita
              </label>
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                min={getFechaMinima()}
                max={getFechaMaxima()}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-2">
                Puedes agendar hasta 3 meses por adelantado
              </p>
            </div>

            {fechaSeleccionada && (
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Horarios disponibles para {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>

                {loadingHorarios ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2 text-sm">Cargando horarios...</p>
                  </div>
                ) : horariosDisponibles.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">No hay horarios disponibles para esta fecha</p>
                    <p className="text-sm text-gray-500 mt-1">Prueba con otra fecha</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {horariosDisponibles.map((horario) => (
                      <button
                        key={horario.hora}
                        onClick={() => handleSelectHorario(horario.hora)}
                        className={`py-3 px-2 rounded-lg font-medium transition ${
                          horarioSeleccionado === horario.hora
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {horario.hora}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {horarioSeleccionado && (
              <button
                onClick={handleContinuarPaso2}
                className="btn btn-primary w-full mt-6 py-3 text-lg"
              >
                Continuar →
              </button>
            )}
          </div>
        )}

        {/* PASO 3: Motivo y Confirmación */}
        {paso === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Confirmar Cita
            </h2>

            {/* Resumen */}
            <div className="card mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-4">Resumen de tu cita</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Profesional</p>
                    <p className="font-semibold text-gray-900">{profesionalSeleccionado?.nombre_completo}</p>
                    <p className="text-sm text-gray-600">{profesionalSeleccionado?.especialidad}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Fecha y Hora</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-CL', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {horarioSeleccionado} ({profesionalSeleccionado?.duracion_cita_minutos} minutos)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivo de Consulta */}
            <div className="card mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la consulta *
              </label>
              <textarea
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                className="input"
                rows="5"
                placeholder="Describe brevemente el motivo de tu consulta..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Esta información ayudará al profesional a prepararse para tu atención
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={() => setPaso(2)}
                className="btn btn-secondary flex-1 py-3"
              >
                ← Volver
              </button>
              <button
                onClick={handleCrearCita}
                disabled={loading || !motivoConsulta.trim()}
                className="btn btn-primary flex-1 py-3 disabled:opacity-50"
              >
                {loading ? 'Agendando...' : '✓ Confirmar Cita'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}