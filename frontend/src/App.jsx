import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import PacienteDashboard from './pages/PacienteDashboard';
import MisCitas from './pages/MisCitas';
import NuevaCita from './pages/NuevaCita';
import DetalleCita from './pages/DetalleCita';
import MiPerfil from './pages/MiPerfil';

// Página 404
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
        <a href="/" className="btn btn-primary">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

// Página no autorizado
function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-8">No autorizado</p>
        <a href="/" className="btn btn-primary">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

// Componente para redirigir según rol
function RoleBasedRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.rol) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'PROFESIONAL':
      return <Navigate to="/profesional" replace />;
    case 'PACIENTE':
      return <Navigate to="/paciente" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Ruta raíz */}
        <Route path="/" element={<RoleBasedRedirect />} />

        {/* Rutas de Paciente */}
        <Route
          path="/paciente"
          element={
            <ProtectedRoute allowedRoles={['PACIENTE']}>
              <PacienteDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/mis-citas"
          element={
            <ProtectedRoute allowedRoles={['PACIENTE']}>
              <MisCitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/nueva-cita"
          element={
            <ProtectedRoute allowedRoles={['PACIENTE']}>
              <NuevaCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/cita/:id"
          element={
            <ProtectedRoute allowedRoles={['PACIENTE']}>
              <DetalleCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/perfil"
          element={
            <ProtectedRoute allowedRoles={['PACIENTE']}>
              <MiPerfil />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Profesional */}
        <Route
          path="/profesional"
          element={
            <ProtectedRoute allowedRoles={['PROFESIONAL']}>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card max-w-md text-center">
                  <h1 className="text-2xl font-bold mb-4">Panel Profesional</h1>
                  <p className="text-gray-600 mb-4">En construcción...</p>
                  <a href="/login" className="btn btn-primary">
                    Cerrar Sesión
                  </a>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card max-w-md text-center">
                  <h1 className="text-2xl font-bold mb-4">Panel Administrador</h1>
                  <p className="text-gray-600 mb-4">En construcción...</p>
                  <a href="/login" className="btn btn-primary">
                    Cerrar Sesión
                  </a>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;