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
import ProfesionalDashboard from './pages/ProfesionalDashboard';
import ProfesionalCitas from './pages/ProfesionalCitas';
import ProfesionalDetalleCita from './pages/ProfesionalDetalleCita';
import ProfesionalDisponibilidad from './pages/ProfesionalDisponibilidad';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminCitas from './pages/AdminCitas';
import AdminReportes from './pages/AdminReportes';



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
      <ProfesionalDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/profesional/mis-citas"
  element={
    <ProtectedRoute allowedRoles={['PROFESIONAL']}>
      <ProfesionalCitas />
    </ProtectedRoute>
  }
/>
<Route
  path="/profesional/cita/:id"
  element={
    <ProtectedRoute allowedRoles={['PROFESIONAL']}>
      <ProfesionalDetalleCita />
    </ProtectedRoute>
  }
/>

<Route
  path="/profesional/disponibilidad"
  element={
    <ProtectedRoute allowedRoles={['PROFESIONAL']}>
      <ProfesionalDisponibilidad />
    </ProtectedRoute>
  }
/>
        {/* Rutas de Admin */}
   
   <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/usuarios"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminUsuarios />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/citas"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminCitas />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/reportes"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminReportes />
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