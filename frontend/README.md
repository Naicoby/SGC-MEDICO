# 🏥 Sistema de Gestión de Citas Médicas (SGC)

Sistema integral para la gestión y agendamiento de citas médicas desarrollado como proyecto de título para Analista Programador - 2025.

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Fase](https://img.shields.io/badge/Fase-1%20Completada-green)
![Backend](https://img.shields.io/badge/Backend-Django%205.0-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)

## 📋 Descripción del Proyecto

SGC es una aplicación web full-stack que digitaliza y automatiza la gestión de citas médicas en clínicas de salud. Permite a los pacientes agendar citas en línea, a los profesionales gestionar su agenda, y a los administradores supervisar todo el sistema.

### ✨ Características Principales

#### 👤 **Módulo de Pacientes** ✅ COMPLETADO
- ✅ Registro y autenticación de usuarios
- ✅ Agendamiento de citas con selección de profesional, fecha y hora
- ✅ Visualización de citas próximas y historial completo
- ✅ Confirmación y cancelación de citas (con restricción de 24 horas)
- ✅ Gestión de perfil personal y cambio de contraseña
- ✅ Control automático de inasistencias

#### 👨‍⚕️ **Módulo de Profesionales** ⏳ En Desarrollo
- ⏳ Dashboard con agenda del día
- ⏳ Gestión de citas (marcar como completadas, agregar notas)
- ⏳ Configuración de disponibilidad horaria
- ⏳ Bloqueo de horarios específicos

#### ⚙️ **Módulo de Administración** ⏳ Pendiente
- ⏳ Gestión de usuarios y roles
- ⏳ Estadísticas y reportes del sistema
- ⏳ Desbloqueo de pacientes
- ⏳ Supervisión de todas las citas

### 🎯 Funcionalidades Clave

- **Control de Inasistencias**: Sistema automático que bloquea usuarios después de 3 inasistencias
- **Validación en Tiempo Real**: Verificación de disponibilidad de horarios al agendar
- **Autenticación Segura**: Implementación de JWT para manejo de sesiones
- **Diseño Responsive**: Interfaz adaptable a dispositivos móviles y escritorio
- **Sistema de Roles**: Diferenciación clara entre Paciente, Profesional y Administrador

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: Django 5.0 + Django REST Framework
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: JWT (djangorestframework-simplejwt)
- **Lenguaje**: Python 3.12
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React 18 con Vite
- **Enrutamiento**: React Router DOM
- **Estado Global**: Zustand
- **Estilos**: Tailwind CSS 3.4
- **HTTP Client**: Axios
- **Utilidades**: date-fns

### Herramientas de Desarrollo
- **Control de Versiones**: Git & GitHub
- **Editor**: Visual Studio Code
- **API Testing**: Thunder Client / Postman

## 📁 Estructura del Proyecto
```
sgc-medico/
├── backend/                    # Aplicación Django
│   ├── apps/
│   │   ├── usuarios/          # Gestión de usuarios y autenticación
│   │   ├── profesionales/     # Gestión de profesionales y disponibilidad
│   │   ├── citas/             # Gestión de citas médicas
│   │   ├── notificaciones/    # Sistema de notificaciones (futuro)
│   │   └── reportes/          # Generación de reportes (futuro)
│   ├── config/                # Configuración de Django
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                   # Aplicación React
│   ├── public/
│   ├── src/
│   │   ├── api/               # Configuración de Axios y servicios
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas principales
│   │   ├── store/             # Estado global (Zustand)
│   │   ├── utils/             # Utilidades
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/                       # Documentación del proyecto
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Python 3.12+
- Node.js 18+
- Git

### 📦 Configuración del Backend
```bash
# Clonar el repositorio
git clone https://github.com/Naicoby/SGC-MEDICO.git
cd SGC-MEDICO/backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario (admin)
python manage.py createsuperuser

# (Opcional) Crear datos de prueba
python crear_datos_prueba.py

# Iniciar servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en: `http://127.0.0.1:8000`

### 🎨 Configuración del Frontend
```bash
# En otra terminal, ir a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📚 API Endpoints

### 🔐 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login/` | Iniciar sesión |
| POST | `/api/v1/auth/register/` | Registrar nuevo usuario |
| POST | `/api/v1/auth/logout/` | Cerrar sesión |
| POST | `/api/v1/auth/refresh/` | Refrescar token |

### 👤 Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/usuarios/me/` | Obtener perfil actual |
| PUT | `/api/v1/usuarios/update_profile/` | Actualizar perfil |
| POST | `/api/v1/usuarios/change_password/` | Cambiar contraseña |

### 👨‍⚕️ Profesionales
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/profesionales/` | Listar profesionales activos |
| GET | `/api/v1/profesionales/{id}/` | Detalle de profesional |
| GET | `/api/v1/profesionales/{id}/disponibilidad/` | Ver disponibilidad semanal |
| POST | `/api/v1/profesionales/{id}/horarios_disponibles/` | Obtener horarios disponibles por fecha |

### 📅 Citas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/citas/` | Listar citas del usuario |
| POST | `/api/v1/citas/` | Crear nueva cita |
| GET | `/api/v1/citas/{id}/` | Detalle de cita |
| GET | `/api/v1/citas/mis_proximas_citas/` | Próximas citas del usuario |
| POST | `/api/v1/citas/{id}/cancelar/` | Cancelar cita |
| POST | `/api/v1/citas/{id}/confirmar/` | Confirmar asistencia |
| POST | `/api/v1/citas/{id}/completar/` | Marcar como completada (profesional) |
| GET | `/api/v1/citas/estadisticas/` | Estadísticas de citas (admin) |

## 📸 Capturas de Pantalla

### Pantalla de Login
*[Agregar captura]*

### Dashboard de Paciente
*[Agregar captura]*

### Agendar Nueva Cita
*[Agregar captura]*

### Gestión de Perfil
*[Agregar captura]*

## 🧪 Testing
```bash
# Backend - Ejecutar tests de Django
cd backend
python manage.py test

# Frontend - Ejecutar tests de React
cd frontend
npm test
```

## 📊 Progreso del Proyecto

- ✅ **FASE 1** (Core del Sistema) - **COMPLETADO**
  - ✅ Sistema de autenticación
  - ✅ Dashboard de paciente
  - ✅ Agendar nueva cita
  - ✅ Ver y gestionar citas
  - ✅ Perfil de usuario

- ⏳ **FASE 2** (Panel Profesional) - **En Desarrollo**
  - ⏳ Dashboard del profesional
  - ⏳ Gestión de agenda
  - ⏳ Configuración de disponibilidad

- ⏳ **FASE 3** (Panel Administrador) - **Pendiente**
- ⏳ **FASE 4** (Mejoras y Optimización) - **Pendiente**
- ⏳ **FASE 5** (Testing y Documentación) - **Pendiente**

**Progreso General**: 40% ██████████░░░░░░░░░░░░░

## 👥 Autores

- **Sebastián Acosta** - Analista Programador
- **Erick Tapia** - Analista Programador

## 🎓 Institución Académica

Proyecto desarrollado como **Proyecto de Título** para la carrera de **Analista Programador** en el marco de la asignatura "Ingeniería de Software - Proyecto Integrado" - 2025.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- A nuestros profesores guías por su apoyo constante
- A la comunidad de Django y React por la documentación
- A todos los que contribuyeron con feedback durante el desarrollo

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

📧 Para consultas: [Naicoby777@gmail.com]