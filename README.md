# 🏥 Sistema de Gestión de Citas Médicas (SGC)



📋 Tabla de Contenidos

Descripción General
Problemática y Solución
Características Principales
Tecnologías Utilizadas
Arquitectura del Sistema
Modelo de Datos
Requisitos Previos
Instalación Detallada
Guía de Uso
Documentación Técnica
Requerimientos Funcionales
Seguridad
Metodología de Desarrollo
Pruebas y Testing
Despliegue
Autores

🎯 Descripción General
El Sistema de Gestión de Citas (SGC) es una aplicación web diseñada para optimizar y digitalizar el proceso de agendamiento de citas médicas en clínicas de salud. Permite a los pacientes agendar citas en línea, a los profesionales de la salud gestionar su disponibilidad y agenda, y a los administradores supervisar y controlar todo el sistema mediante reportes y estadísticas en tiempo real.
Contexto del Proyecto
Este sistema fue desarrollado como Proyecto de Título para la carrera de Analista Programador durante el año 2025, con el objetivo de aplicar conocimientos en:


Arquitectura de Software
Bases de Datos Relacionales
API REST
Metodologías Ágiles (Scrum)
Contenedorización (Docker)
Procesamiento Asíncrono


🔴 Problemática y Solución
Análisis de la Situación Actual
Las clínicas de salud enfrentan desafíos significativos en su operación diaria debido a la falta de un sistema digitalizado:
ProblemaImpactoConsecuenciaDuplicidad de reservasAltoSobreventa de horas, citas en el mismo horarioFalta de control en agendasAltoSin visibilidad en tiempo real de disponibilidadGestión manual de inasistenciasMedioNo hay penalización automática por "No Show"Sin recordatorios automáticosAltoAltas tasas de inasistencias (30-40%)Reportes manualesMedioDifícil obtener estadísticas actualizadasProceso administrativo pesadoAltoSobrecarga del personal administrativo
Solución Propuesta
El SGC aborda estas problemáticas mediante:
✅ Sistema digital de agendamiento con validación automática de disponibilidad
✅ Control automático de inasistencias con bloqueo tras 3 faltas
✅ Recordatorios automatizados 24 horas antes vía email/SMS (Celery)
✅ Reportes en tiempo real con estadísticas y métricas del sistema
✅ Gestión centralizada de disponibilidad de profesionales
✅ Historial completo de citas y cambios de estado
Beneficios Esperados

Reducción de 60% en tiempo de agendamiento
Disminución de 30% en inasistencias
Incremento de 20% en utilización de horarios disponibles
Mejora del 40% en satisfacción del paciente (NPS)
Optimización del 50% en carga administrativa


✨ Características Principales
👤 Módulo de Pacientes (COMPLETADO ✅)
Funcionalidades

Registro y Autenticación

Registro con RUT chileno validado
Login con JWT (access + refresh tokens)
Cierre de sesión seguro


Agendamiento de Citas

Búsqueda de profesionales por especialidad
Selección de fecha y hora disponible (flujo de 3 pasos)
Validación en tiempo real de disponibilidad
Confirmación inmediata con detalles


Gestión de Citas

Visualización de citas próximas en dashboard
Historial completo de citas (pasadas y futuras)
Filtros por estado y fecha
Confirmación de asistencia
Cancelación (hasta 24 horas antes)


Perfil Personal

Edición de datos personales
Cambio de contraseña
Visualización de contador de inasistencias
Estado de bloqueo (si aplica)



Flujo de Usuario Paciente
1. Login → 2. Dashboard → 3. Agendar Cita
   ↓                           ↓
4. Ver Citas ← 5. Confirmar ← 6. Recibir Recordatorio
   ↓
7. Asistir → 8. Historial Actualizado

👨‍⚕️ Módulo de Profesionales (COMPLETADO ✅)
Funcionalidades

Dashboard Profesional

Estadísticas del día (citas totales, completadas, pendientes)
Agenda del día con detalles de cada cita
Vista rápida de próximos pacientes


Gestión de Citas

Visualización de todas las citas asignadas
Filtros por fecha y estado
Detalle completo de cada cita con datos del paciente
Agregar notas médicas después de la atención
Marcar citas como completadas
Registrar inasistencias ("No Show")


Gestión de Disponibilidad

CRUD completo de horarios de atención
Configuración por día de la semana
Definición de hora inicio y fin
Activar/desactivar horarios sin eliminarlos
Bloqueo de horarios específicos para tareas administrativas


Mi Perfil

Visualización de datos profesionales
Edición de información de contacto
Cambio de contraseña



Flujo de Usuario Profesional
1. Login → 2. Dashboard → 3. Ver Agenda del Día
   ↓                           ↓
4. Atender Paciente → 5. Agregar Notas → 6. Completar Cita
   ↓
7. Gestionar Disponibilidad → 8. Configurar Horarios

👨‍💼 Módulo de Administración (COMPLETADO ✅)
Funcionalidades

Dashboard Administrativo

Métricas generales del sistema en tiempo real
Total de usuarios (pacientes, profesionales, admins)
Total de citas y distribución por estado
Tasa de inasistencia global
Usuarios bloqueados
Accesos rápidos a módulos principales


Gestión de Usuarios

Lista completa de usuarios con filtros
Búsqueda por nombre, RUT o email
Filtros por rol (Paciente, Profesional, Admin)
Filtros por estado (Activo, Bloqueado)
Bloquear usuarios manualmente (con motivo)
Desbloquear usuarios (con justificación)
Visualización de contador de inasistencias
Acceso a perfil detallado


Gestión de Profesionales

Lista de todos los profesionales
Visualización de especialidad y datos profesionales
Activar/desactivar profesionales para citas
Ver disponibilidad configurada
Estadísticas de atención


Gestión de Citas

Visualización de todas las citas del sistema
Filtros avanzados (fecha, estado, profesional)
Búsqueda por paciente o profesional
Estadísticas por estado
Acceso a detalles completos


Reportes y Estadísticas

Estadísticas generales de citas
Tasa de inasistencia calculada
Lista de usuarios bloqueados
Pacientes con más inasistencias
Profesionales activos
Exportación de datos (futuro)



Flujo de Usuario Administrador
1. Login → 2. Dashboard → 3. Ver Métricas
   ↓                           ↓
4. Gestionar Usuarios → 5. Bloquear/Desbloquear
   ↓                           ↓
6. Revisar Reportes → 7. Gestionar Profesionales

🛠️ Tecnologías Utilizadas
Backend (Python/Django)
TecnologíaVersiónPropósitoPython3.12Lenguaje de programación principalDjango5.0.1Framework web backendDjango REST Framework3.14.0Construcción de API RESTfuldjangorestframework-simplejwt5.3.1Autenticación JWTdjango-cors-headers4.3.1Manejo de CORSdjango-filter23.5Filtrado avanzado en APIPostgreSQL15Base de datos relacionalpsycopg2-binary2.9.9Adaptador PostgreSQLRedis7Caché y broker de mensajesCelery5.3.4Procesamiento de tareas asíncronasPillow10.2.0Procesamiento de imágenes
¿Por qué Django?

MTV (Model-Template-View): Arquitectura clara y organizada
ORM Potente: Abstracción de base de datos sin SQL directo
Admin Panel: Panel administrativo automático
Seguridad: Protección CSRF, XSS, SQL Injection por defecto
Escalabilidad: Usado por Instagram, Spotify, Pinterest
Comunidad: Gran ecosistema de paquetes

Frontend (React/Vite)
TecnologíaVersiónPropósitoReact18Biblioteca de interfaz de usuarioVite5Build tool ultrarrápidoReact Router DOM6.22.3Enrutamiento SPAZustand4.5.2Gestión de estado globalAxios1.6.8Cliente HTTP para APITailwind CSS3.4Framework de estilos utility-firstdate-fns3.4.0Manipulación de fechas
¿Por qué React?

Component-Based: Reutilización y modularidad
Virtual DOM: Rendimiento optimizado
Ecosistema: Mayor cantidad de librerías
Hooks: Lógica reutilizable (useState, useEffect, custom hooks)
Comunidad: Stack más demandado en el mercado

¿Por qué Vite?

HMR (Hot Module Replacement): Actualizaciones instantáneas
Build rápido: 10-100x más rápido que Webpack
ES Modules: Uso nativo del navegador
Configuración mínima: Setup simple

DevOps e Infraestructura
TecnologíaVersiónPropósitoDocker24+Contenedorización de aplicacionesDocker Compose2.0+Orquestación multi-contenedorGit-Control de versionesGitHub-Repositorio remoto y colaboración

🏗️ Arquitectura del Sistema
Arquitectura General
El sistema implementa una arquitectura de microservicios utilizando contenedores Docker, siguiendo el patrón Cliente-Servidor con API REST.
┌─────────────────────────────────────────────────────────┐
│             Cliente (Navegador Web)                     │
│                   React SPA                             │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS (REST API)
                     │ JSON (Request/Response)
                     │
┌────────────────────▼────────────────────────────────────┐
│              Capa de Presentación                       │
│          Frontend React (Puerto 5173)                   │
│  - Componentes UI                                       │
│  - Gestión de Estado (Zustand)                         │
│  - Enrutamiento (React Router)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Axios HTTP Client
                     │ JWT Authentication
                     │
┌────────────────────▼────────────────────────────────────┐
│           Capa de Lógica de Negocio                     │
│          Backend Django (Puerto 8000)                   │
│  ┌──────────────────────────────────────┐              │
│  │  Django REST Framework API           │              │
│  │  - Serializers (Validación)          │              │
│  │  - ViewSets (Lógica)                 │              │
│  │  - Routers (Endpoints)               │              │
│  └──────────────────────────────────────┘              │
│  ┌──────────────────────────────────────┐              │
│  │  Autenticación JWT                   │              │
│  │  - Access Token (15 min)             │              │
│  │  - Refresh Token (1 día)             │              │
│  └──────────────────────────────────────┘              │
│  ┌──────────────────────────────────────┐              │
│  │  Middleware                          │              │
│  │  - CORS                              │              │
│  │  - Authentication                    │              │
│  │  - Logging                           │              │
│  └──────────────────────────────────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬─────────────┐
        │            │            │             │
┌───────▼──────┐ ┌──▼──────┐ ┌──▼─────────┐ ┌─▼──────────┐
│  PostgreSQL  │ │  Redis  │ │   Celery   │ │   Celery   │
│    (DB)      │ │ (Cache) │ │   Worker   │ │    Beat    │
│              │ │         │ │            │ │ (Scheduler)│
│ - usuarios   │ │ - Queue │ │ - Tasks    │ │ - Cron     │
│ - citas      │ │ - Cache │ │ - Email    │ │ - Jobs     │
│ - prof.      │ │ - Broker│ │ - Reports  │ │            │
└──────────────┘ └─────────┘ └────────────┘ └────────────┘
   (Puerto 5432)  (Puerto 6379)
Descripción de Capas
1. Capa de Presentación (Frontend)

Responsabilidad: Interfaz de usuario e interacción
Tecnología: React 18 + Vite + Tailwind CSS
Características:

SPA (Single Page Application)
Rutas protegidas por rol
Estado global con Zustand
Interceptores HTTP con Axios



2. Capa de Lógica de Negocio (Backend)

Responsabilidad: Procesar solicitudes, validar datos, aplicar reglas de negocio
Tecnología: Django 5 + DRF
Características:

API RESTful con versionado
Autenticación JWT con refresh
Validaciones de negocio
Permisos por rol



3. Capa de Datos

PostgreSQL: Persistencia de datos
Redis: Caché y cola de mensajes
Características:

Modelo relacional normalizado
Índices optimizados
Transacciones ACID



4. Capa de Procesamiento Asíncrono

Celery Worker: Ejecuta tareas en background
Celery Beat: Programa tareas periódicas
Uso:

Envío de recordatorios
Generación de reportes
Limpieza automática de datos




Patrones de Diseño Implementados
1. MVC/MTV (Model-View-Controller)
Django implementa el patrón MTV (Model-Template-View):

Model: Define la estructura de datos (ORM)
View: Lógica de negocio (ViewSets en DRF)
Template: Serializers (transformación JSON)

2. Repository Pattern
Los ViewSets actúan como repositorios:
python# Abstracción de acceso a datos
class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()  # Repository
    serializer_class = CitaSerializer
3. Singleton Pattern
Zustand implementa un store global único:
javascriptexport const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
4. Observer Pattern
React hooks observan cambios de estado:
javascriptuseEffect(() => {
  // Se ejecuta cuando 'user' cambia
}, [user]);
5. Factory Pattern
Serializers crean objetos según contexto:
pythondef get_serializer_class(self):
    if self.action == 'create':
        return CitaCreateSerializer
    return CitaSerializer
```

---

## 💾 Modelo de Datos

### Diagrama Entidad-Relación
```
┌─────────────────────────────────────────────────────────┐
│                     USUARIO                             │
├─────────────────────────────────────────────────────────┤
│ PK  id (AutoField)                                      │
│ UK  rut (CharField 12)                                  │
│ UK  email (EmailField)                                  │
│     password (CharField hashed)                         │
│     nombre (CharField 100)                              │
│     apellido (CharField 100)                            │
│     fecha_nacimiento (DateField)                        │
│     telefono (CharField 15)                             │
│     direccion (TextField)                               │
│     rol (CharField: PACIENTE/PROFESIONAL/ADMIN)         │
│     is_active (Boolean default=True)                    │
│     is_staff (Boolean default=False)                    │
│     bloqueado (Boolean default=False)                   │
│     fecha_bloqueo (DateTimeField nullable)              │
│     motivo_bloqueo (TextField nullable)                 │
│     contador_inasistencias (Integer default=0)          │
│     created_at (DateTimeField auto_now_add)             │
│     updated_at (DateTimeField auto_now)                 │
└──────────────┬──────────────────────────────────────────┘
               │
               │ 1:N (herencia)
               │
┌──────────────▼──────────────────────────────────────────┐
│                  PROFESIONAL                            │
├─────────────────────────────────────────────────────────┤
│ PK  id (AutoField)                                      │
│ FK  usuario (OneToOne → Usuario)                        │
│     especialidad (CharField 100)                        │
│     titulo_profesional (CharField 200)                  │
│     registro_profesional (CharField 50)                 │
│     duracion_cita_minutos (Integer default=30)          │
│     activo_para_citas (Boolean default=True)            │
│     created_at (DateTimeField)                          │
│     updated_at (DateTimeField)                          │
└──────────────┬──────────────────────────────────────────┘
               │
               │ 1:N
               │
┌──────────────▼──────────────────────────────────────────┐
│              DISPONIBILIDAD_PROFESIONAL                 │
├─────────────────────────────────────────────────────────┤
│ PK  id (AutoField)                                      │
│ FK  profesional (ForeignKey → Profesional)              │
│     dia_semana (Integer: 0-6)                           │
│     hora_inicio (TimeField)                             │
│     hora_fin (TimeField)                                │
│     activo (Boolean default=True)                       │
│     created_at (DateTimeField)                          │
│     updated_at (DateTimeField)                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     CITA                                │
├─────────────────────────────────────────────────────────┤
│ PK  id (AutoField)                                      │
│ FK  paciente (ForeignKey → Usuario)                     │
│ FK  profesional (ForeignKey → Profesional)              │
│     fecha_hora (DateTimeField)                          │
│     estado (CharField: AGENDADA/CONFIRMADA/COMPLETADA/  │
│            CANCELADA/NO_ASISTIO)                        │
│     motivo_consulta (TextField)                         │
│     notas_profesional (TextField nullable)              │
│     confirmada_por_paciente (Boolean default=False)     │
│     fecha_confirmacion (DateTimeField nullable)         │
│     motivo_cancelacion (TextField nullable)             │
│     fecha_cancelacion (DateTimeField nullable)          │
│ FK  cancelada_por (ForeignKey → Usuario nullable)       │
│     created_at (DateTimeField)                          │
│     updated_at (DateTimeField)                          │
└──────────────┬──────────────────────────────────────────┘
               │
               │ 1:N
               │
┌──────────────▼──────────────────────────────────────────┐
│              HISTORIAL_CITA                             │
├─────────────────────────────────────────────────────────┤
│ PK  id (AutoField)                                      │
│ FK  cita (ForeignKey → Cita)                            │
│     estado_anterior (CharField)                         │
│     estado_nuevo (CharField)                            │
│     fecha_cambio (DateTimeField auto_now_add)           │
│ FK  modificado_por (ForeignKey → Usuario)               │
│     observaciones (TextField nullable)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              HISTORIAL_BLOQUEO                          │
├─────────────────────────────────────────────────────────┤
│ PK  id (AutoField)                                      │
│ FK  usuario (ForeignKey → Usuario)                      │
│     fecha_bloqueo (DateTimeField auto_now_add)          │
│     motivo_bloqueo (TextField)                          │
│ FK  bloqueado_por (ForeignKey → Usuario)                │
│     fecha_desbloqueo (DateTimeField nullable)           │
│     motivo_desbloqueo (TextField nullable)              │
│ FK  desbloqueado_por (ForeignKey → Usuario nullable)    │
└─────────────────────────────────────────────────────────┘
Cardinalidades y Relaciones
RelaciónCardinalidadDescripciónUsuario → Profesional1:1Un usuario puede ser un profesionalUsuario → Cita (paciente)1:NUn paciente puede tener muchas citasProfesional → Cita1:NUn profesional atiende muchas citasProfesional → Disponibilidad1:NUn profesional tiene múltiples horariosCita → HistorialCita1:NUna cita tiene muchos cambios de estadoUsuario → HistorialBloqueo1:NUn usuario puede tener múltiples bloqueos
Índices Implementados
sql-- Índices para optimización de consultas
CREATE INDEX idx_usuario_rut ON usuario(rut);
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_cita_fecha_hora ON cita(fecha_hora);
CREATE INDEX idx_cita_paciente ON cita(paciente_id);
CREATE INDEX idx_cita_profesional ON cita(profesional_id);
CREATE INDEX idx_cita_estado ON cita(estado);
CREATE INDEX idx_disponibilidad_profesional ON disponibilidad_profesional(profesional_id);
CREATE INDEX idx_disponibilidad_dia ON disponibilidad_profesional(dia_semana);

📦 Requisitos Previos
Opción 1: Instalación con Docker (Recomendado ⭐)
Requisitos mínimos:

Docker Desktop v20.10 o superior
Docker Compose v2.0 o superior
Git para clonar el repositorio
8 GB RAM mínimo
10 GB de espacio en disco

Sistema operativo:

✅ Windows 10/11 (64-bit) con WSL2
✅ macOS 10.15 o superior
✅ Linux (Ubuntu 20.04+, Debian 11+, etc.)

NO necesitas instalar:

❌ Python
❌ Node.js
❌ PostgreSQL
❌ Redis

Opción 2: Instalación Manual (Desarrollo Local)
Si prefieres ejecutar sin Docker:
Backend:

Python 3.12+
PostgreSQL 15+
Redis 7+

Frontend:

Node.js 18+ con npm


🚀 Instalación Detallada
OPCIÓN 1: Instalación con Docker (Recomendado)
Paso 1: Instalar Docker Desktop
Windows:

Descargar de: https://www.docker.com/products/docker-desktop
Ejecutar el instalador
Reiniciar el sistema
Verificar instalación:

powershelldocker --version
docker-compose --version
macOS:
bash# Con Homebrew
brew install --cask docker

# Verificar
docker --version
docker-compose --version
Linux (Ubuntu/Debian):
bash# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Verificar
docker --version
docker compose version
Paso 2: Clonar el Repositorio
bashgit clone https://github.com/Naicoby/SGC-MEDICO.git
cd SGC-MEDICO
```

#### Paso 3: Estructura de Archivos

Verifica que tienes esta estructura:
```
SGC-MEDICO/
├── backend/
│   ├── apps/
│   ├── config/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
Paso 4: Levantar los Servicios
bash# Construir e iniciar todos los contenedores
docker-compose up --build
¿Qué hace este comando?

✅ Lee docker-compose.yml
✅ Construye la imagen del backend (Django)
✅ Construye la imagen del frontend (React)
✅ Descarga imagen de PostgreSQL
✅ Descarga imagen de Redis
✅ Crea la red sgc_network
✅ Inicia contenedor de base de datos
✅ Espera healthcheck de PostgreSQL
✅ Aplica migraciones automáticamente
✅ Inicia contenedor del backend
✅ Inicia Celery Worker
✅ Inicia Celery Beat
✅ Inicia contenedor del frontend

Tiempo estimado: 3-5 minutos la primera vez
Logs esperados:
✔ Network sgc-medico_sgc_network   Created
✔ Volume sgc-medico_postgres_data  Created
✔ Container sgc_db                 Healthy
✔ Container sgc_redis              Healthy
✔ Container sgc_backend            Started
✔ Container sgc_celery_worker      Started
✔ Container sgc_celery_beat        Started
✔ Container sgc_frontend           Started

sgc_db            | database system is ready to accept connections
sgc_redis         | Ready to accept connections tcp
sgc_backend       | Starting development server at http://0.0.0.0:8000/
sgc_celery_worker |
celery@... ready.
sgc_celery_beat   |  beat: Starting...
sgc_frontend      | ➜  Local:   http://localhost:5173/

#### Paso 5: Crear Superusuario

En **otra terminal** (mientras Docker sigue corriendo):
```bash
# Entrar al contenedor del backend
docker-compose exec backend python manage.py createsuperuser
```

Ingresa los datos:
RUT: 12345678-9
Correo Electrónico: admin@clinica.cl
Nombre: Admin
Apellido: Sistema
Fecha de nacimiento (YYYY-MM-DD): 1990-01-01
Teléfono: +56912345678
Dirección: Administración Central
Password: admin123
Password (again): admin123
Superuser created successfully.

#### Paso 6: (Opcional) Cargar Datos de Prueba
```bash
# Ejecutar script de datos de prueba
docker-compose exec backend python crear_datos_prueba.py
```

Esto creará:
- 👤 **3 pacientes**: RUT 11111111-1, 22222222-2, 33333333-3
- 👨‍⚕️ **2 profesionales**: RUT 44444444-4, 55555555-5
- 📅 **Citas de ejemplo**
- ⏰ **Disponibilidad configurada**

#### Paso 7: Acceder al Sistema

Abre tu navegador en:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost:5173 | - |
| **Backend API** | http://localhost:8000/api/v1 | - |
| **Admin Django** | http://localhost:8000/admin | admin@clinica.cl / admin123 |
| **PostgreSQL** | localhost:5432 | sgc_user / sgc_password123 |
| **Redis** | localhost:6379 | Sin contraseña |

**Usuarios de Prueba:**

| Rol | RUT | Password | Descripción |
|-----|-----|----------|-------------|
| Paciente | 11111111-1 | paciente123 | Paciente sin inasistencias |
| Paciente | 22222222-2 | paciente123 | Paciente con 2 inasistencias |
| Profesional | 44444444-4 | doctor123 | Dr. Juan Pérez (Medicina General) |
| Profesional | 55555555-5 | doctor123 | Dra. María González (Cardiología) |
| Admin | 12345678-9 | admin123 | Administrador del sistema |

---

### OPCIÓN 2: Instalación Manual (Sin Docker)

<details>
<summary><b>Click para expandir guía de instalación manual</b></summary>

#### Requisitos Previos
- Python 3.12
- Node.js 18
- PostgreSQL 15
- Redis 7
- Git

#### Backend (Django)
```bash
# 1. Clonar repositorio
git clone https://github.com/Naicoby/SGC-MEDICO.git
cd SGC-MEDICO/backend

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Configurar variables de entorno
# Crear archivo .env en backend/
cat > .env << EOF
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sgc_db
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
EOF

# 6. Crear base de datos PostgreSQL
psql -U postgres
CREATE DATABASE sgc_db;
CREATE USER sgc_user WITH PASSWORD 'sgc_password123';
GRANT ALL PRIVILEGES ON DATABASE sgc_db TO sgc_user;
\q

# 7. Aplicar migraciones
python manage.py migrate

# 8. Crear superusuario
python manage.py createsuperuser

# 9. Cargar datos de prueba (opcional)
python crear_datos_prueba.py

# 10. Iniciar servidor
python manage.py runserver
```

#### Frontend (React)

En **otra terminal**:
```bash
cd ../frontend

# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cat > .env << EOF
VITE_API_URL=http://localhost:8000/api/v1
EOF

# 3. Iniciar servidor de desarrollo
npm run dev
```

#### Celery (Tareas Asíncronas)

En **otra terminal**:
```bash
cd backend

# Activar entorno virtual
source venv/bin/activate  # o venv\Scripts\activate en Windows

# Iniciar Celery Worker
celery -A config worker --loglevel=info
```

En **otra terminal** más:
```bash
cd backend
source venv/bin/activate

# Iniciar Celery Beat (scheduler)
celery -A config beat --loglevel=info
```

#### Verificar Instalación

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000/api/v1
- **Admin**: http://localhost:8000/admin

</details>

---

## 🔧 Comandos Útiles

### Docker Compose
```bash
# Ver logs en tiempo real (todos los servicios)
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f celery_worker
docker-compose logs -f frontend

# Detener todos los servicios (mantiene datos)
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart celery_worker

# Reconstruir un servicio
docker-compose up --build backend

# Ver estado de contenedores
docker-compose ps

# Ejecutar comando en contenedor
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py shell

# Acceder al shell de un contenedor
docker-compose exec backend bash
docker-compose exec frontend sh

# Ver uso de recursos
docker stats
```

### Django Management
```bash
# Dentro del contenedor backend

# Crear migraciones
docker-compose exec backend python manage.py makemigrations

# Aplicar migraciones
docker-compose exec backend python manage.py migrate

# Crear superusuario
docker-compose exec backend python manage.py createsuperuser

# Shell interactivo de Django
docker-compose exec backend python manage.py shell

# Resetear contraseña de usuario
docker-compose exec backend python manage.py changepassword <rut>

# Colectar archivos estáticos
docker-compose exec backend python manage.py collectstatic

# Ver rutas registradas
docker-compose exec backend python manage.py show_urls
```

### Celery
```bash
# Ver tareas registradas
docker-compose exec celery_worker celery -A config inspect registered

# Ver tareas activas
docker-compose exec celery_worker celery -A config inspect active

# Purgar todas las tareas pendientes
docker-compose exec celery_worker celery -A config purge

# Ver workers activos
docker-compose exec celery_worker celery -A config inspect ping
```

### Probar Tareas Celery Manualmente
```bash
# Entrar al shell de Django
docker-compose exec backend python manage.py shell

# Dentro del shell:
>>> from apps.citas.tasks import enviar_recordatorios_citas
>>> result = enviar_recordatorios_citas.delay()
>>> print(f"Tarea ejecutada: {result.id}")
>>> exit()
```

### PostgreSQL
```bash
# Acceder a PostgreSQL
docker-compose exec db psql -U sgc_user -d sgc_db

# Listar tablas
\dt

# Ver estructura de tabla
\d usuarios_usuario

# Ejecutar consulta
SELECT * FROM usuarios_usuario LIMIT 5;

# Salir
\q
```

### Redis
```bash
# Acceder a Redis CLI
docker-compose exec redis redis-cli

# Ver todas las keys
KEYS *

# Ver valor de una key
GET <key>

# Limpiar toda la caché
FLUSHALL

# Salir
exit
```

---

## 💻 Guía de Uso

### 1. Login y Registro

#### Flujo de Registro
1. Acceder a http://localhost:5173
2. Clic en "Registrarse"
3. Completar formulario:
   - RUT (con guión, ej: 12345678-9)
   - Email
   - Nombre y Apellido
   - Fecha de nacimiento
   - Teléfono (+56912345678)
   - Dirección
   - Contraseña (mínimo 8 caracteres)
4. Clic en "Registrarse"
5. Redirige automáticamente al login

#### Flujo de Login
1. Ingresar RUT y contraseña
2. Sistema valida credenciales
3. Genera Access Token (15 min) y Refresh Token (1 día)
4. Redirige según rol:
   - **Paciente** → `/dashboard`
   - **Profesional** → `/profesional`
   - **Admin** → `/admin`

---

### 2. Módulo Paciente

#### Dashboard
- **Ubicación**: `/dashboard`
- **Elementos**:
  - Tarjeta de bienvenida con nombre
  - Contador de citas próximas
  - Contador de citas completadas
  - Estado de bloqueo (si aplica)
  - Lista de próximas 5 citas con:
    - Profesional y especialidad
    - Fecha y hora
    - Estado (badge de color)
    - Acciones rápidas (ver detalle, cancelar)

#### Agendar Nueva Cita

**Flujo de 3 Pasos:**

**Paso 1: Seleccionar Profesional**
- Ver lista de profesionales activos
- Filtrar por especialidad
- Ver duración de cita
- Clic en "Seleccionar"

**Paso 2: Seleccionar Fecha y Hora**
- Calendario interactivo
- Solo fechas futuras habilitadas
- Ver horarios disponibles del profesional
- Horarios bloqueados en gris
- Seleccionar hora específica

**Paso 3: Confirmar Cita**
- Resumen de la cita:
  - Profesional y especialidad
  - Fecha y hora
  - Duración estimada
- Ingresar motivo de consulta (opcional)
- Botones:
  - "Volver" (regresa al paso anterior)
  - "Confirmar" (agenda la cita)

**Después de confirmar:**
- Mensaje de éxito
- Email de confirmación (si configurado)
- Redirige a "Mis Citas"

#### Mis Citas
- **Ubicación**: `/citas`
- **Funcionalidades**:
  - Tabs: "Próximas" y "Historial"
  - Filtros:
    - Por fecha (calendario)
    - Por estado (dropdown)
    - Búsqueda por profesional
  - Cada cita muestra:
    - ID de cita
    - Profesional y especialidad
    - Fecha y hora
    - Estado (badge)
    - Botón "Ver Detalle"

#### Detalle de Cita
- **Ubicación**: `/cita/{id}`
- **Información mostrada**:
  - Datos del profesional
  - Fecha, hora y duración
  - Estado actual
  - Motivo de consulta
  - Notas del profesional (si existen)
  - Fecha de creación
- **Acciones disponibles según estado**:
  - **AGENDADA**: Confirmar o Cancelar
  - **CONFIRMADA**: Cancelar (solo hasta 24h antes)
  - **COMPLETADA/CANCELADA/NO_ASISTIO**: Solo lectura

#### Mi Perfil
- **Ubicación**: `/perfil`
- **Pestañas**:
  
  **Información Personal:**
  - Ver y editar datos:
    - RUT (no editable)
    - Email
    - Nombre y Apellido
    - Teléfono
    - Dirección
  - Botón "Guardar Cambios"

  **Cambiar Contraseña:**
  - Contraseña actual
  - Nueva contraseña
  - Confirmar nueva contraseña
  - Validaciones:
    - Contraseña actual correcta
    - Nueva diferente a la actual
    - Mínimo 8 caracteres
    - Ambas nuevas coinciden

  **Estado de Cuenta:**
  - Contador de inasistencias
  - Estado de bloqueo
  - Fecha de último bloqueo (si aplica)
  - Motivo de bloqueo (si aplica)

---

### 3. Módulo Profesional

#### Dashboard Profesional
- **Ubicación**: `/profesional`
- **Métricas del Día**:
  - Total de citas
  - Citas completadas
  - Citas pendientes
  - Próxima cita (con countdown)
- **Agenda del Día**:
  - Timeline visual de citas
  - Información de paciente
  - Estado de cada cita
  - Acciones rápidas

#### Mis Citas
- **Ubicación**: `/profesional/citas`
- **Funcionalidades**:
  - Filtros por fecha (hoy, semana, mes, personalizado)
  - Filtros por estado
  - Búsqueda por nombre de paciente
  - Vista de lista o calendario
  - Cada cita muestra:
    - Paciente
    - Hora
    - Duración
    - Estado
    - Botón "Ver Detalle"

#### Detalle de Cita (Profesional)
- **Ubicación**: `/profesional/cita/{id}`
- **Información del Paciente**:
  - Nombre completo
  - RUT
  - Email y teléfono
  - Inasistencias previas
- **Información de la Cita**:
  - Fecha y hora
  - Estado
  - Motivo de consulta
- **Notas Médicas**:
  - Editor de texto
  - Guardar notas
- **Acciones**:
  - **Marcar como Completada** (botón verde)
  - **Marcar No Asistió** (botón rojo)
  - Modal de confirmación para cada acción

#### Gestión de Disponibilidad
- **Ubicación**: `/profesional/disponibilidad`
- **Vista por Día de la Semana**:
  - Lunes a Domingo
  - Horarios configurados por día
  - Estado (activo/inactivo)
- **CRUD de Horarios**:
  - **Crear**: Modal con formulario
    - Día de la semana (dropdown)
    - Hora inicio (time picker)
    - Hora fin (time picker)
    - Estado activo (checkbox)
  - **Editar**: Mismo modal, datos pre-cargados
  - **Activar/Desactivar**: Toggle rápido sin eliminar
  - **Eliminar**: Con confirmación

**Validaciones**:
- Hora fin > hora inicio
- No solapamiento de horarios en el mismo día
- Formato 24 horas

---

### 4. Módulo Administrador

#### Dashboard Admin
- **Ubicación**: `/admin`
- **Tarjetas de Métricas**:
  1. **Total Usuarios** (azul)
     - Número total
     - Desglose (X pacientes)
  2. **Profesionales** (verde)
     - Total activos
  3. **Total Citas** (morado)
     - Total de citas
     - X pendientes
  4. **Inasistencias** (rojo)
     - Tasa %
     - X usuarios bloqueados
- **Accesos Rápidos**:
  - Gestionar Usuarios
  - Profesionales
  - Todas las Citas
  - Reportes
  - Configuración
  - Mi Perfil
- **Alertas**:
  - Usuarios bloqueados (si > 0)
  - Tasa de inasistencia alta (si > 20%)

#### Gestión de Usuarios
- **Ubicación**: `/admin/usuarios`
- **Estadísticas Superiores**:
  - Total, Pacientes, Profesionales, Bloqueados
- **Filtros**:
  - Todos / Activos / Bloqueados
  - Pacientes / Profesionales / Admins
  - Búsqueda por nombre, RUT, email
- **Tabla de Usuarios**:
  - Avatar con iniciales
  - Nombre completo y email
  - RUT
  - Rol (badge de color)
  - Estado (Activo/Bloqueado)
  - Contador de inasistencias
  - Acciones:
    - 🔒 Bloquear (si está activo)
    - 🔓 Desbloquear (si está bloqueado)
    - 👁️ Ver detalles

**Modal de Bloqueo**:
- Advertencia clara
- Datos del usuario
- Campo de motivo (obligatorio)
- Confirmación

**Modal de Desbloqueo**:
- Datos del usuario
- Motivo del bloqueo original
- Campo de motivo de desbloqueo (obligatorio)
- Confirmación

#### Gestión de Profesionales
- **Ubicación**: `/admin/profesionales`
- **Estadísticas**:
  - Total, Activos, Inactivos
- **Tarjetas de Profesionales**:
  - Foto/avatar
  - Nombre completo
  - Especialidad
  - Título profesional
  - Registro profesional
  - Duración de cita
  - Estado (Activo/Inactivo)
  - Acciones:
    - ⏸ Desactivar / ▶ Activar
    - Ver Detalles

#### Gestión de Citas
- **Ubicación**: `/admin/citas`
- **Estadísticas por Estado**:
  - Total, Pendientes, Completadas, Canceladas, No Asistió
- **Filtros Avanzados**:
  - Por fecha (calendario)
  - Por estado (tabs)
  - Búsqueda por paciente o profesional
- **Tabla de Citas**:
  - ID
  - Paciente
  - Profesional y especialidad
  - Fecha
  - Hora
  - Estado (badge)
  - Botón "Ver detalles"

#### Reportes
- **Ubicación**: `/admin/reportes`
- **Secciones**:

  **1. Estadísticas Generales de Citas**:
  - Total de citas (número grande)
  - Completadas
  - No Asistió
  - Tasa de inasistencia (%)
  - Desglose por estado:
    - Agendadas
    - Confirmadas
    - Canceladas

  **2. Profesionales Activos**:
  - Grid de tarjetas
  - Cada profesional muestra:
    - Nombre y especialidad
    - Duración de cita
    - Icono de estado

  **3. Usuarios Bloqueados**:
  - Lista con fondo rojo claro
  - Nombre, RUT
  - Contador de inasistencias
  - Botón "Ver Detalles"

  **4. Pacientes con Inasistencias**:
  - Lista con fondo amarillo claro
  - Nombre, RUT
  - Número de inasistencias (destacado)
  - Top 5 con más inasistencias

---

## 📖 Documentación Técnica

### API REST

#### Estructura de Respuestas

**Respuesta Exitosa:**
```json
{
  "status": "success",
  "data": {
    // datos solicitados
  },
  "message": "Operación exitosa"
}
```

**Respuesta de Error:**
```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": {
      // detalles adicionales si aplica
    }
  }
}
```

**Lista Paginada:**
```json
{
  "count": 100,
  "next": "http://api.example.com/usuarios/?page=2",
  "previous": null,
  "results": [
    // array de objetos
  ]
}
```

#### Autenticación

**Login:**
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "rut": "12345678-9",
  "password": "admin123"
}

Response 200:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "rut": "12345678-9",
    "email": "admin@clinica.cl",
    "nombre": "Admin",
    "apellido": "Sistema",
    "rol": "ADMIN",
    "bloqueado": false
  }
}
```

**Refresh Token:**
```http
POST /api/v1/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response 200:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Usar Token:**
```http
GET /api/v1/citas/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Endpoints Principales

**Usuarios:**
```http
# Listar usuarios (admin)
GET /api/v1/usuarios/

# Crear usuario (registro)
POST /api/v1/usuarios/
{
  "rut": "12345678-9",
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fecha_nacimiento": "1990-01-15",
  "telefono": "+56912345678",
  "direccion": "Calle Falsa 123"
}

# Ver mi perfil
GET /api/v1/usuarios/me/

# Actualizar mi perfil
PUT /api/v1/usuarios/update_profile/
{
  "email": "nuevo@example.com",
  "telefono": "+56987654321",
  "direccion": "Nueva Dirección 456"
}

# Cambiar contraseña
POST /api/v1/usuarios/change_password/
{
  "current_password": "old_password",
  "new_password": "new_password"
}

# Bloquear usuario (admin)
POST /api/v1/usuarios/{id}/bloquear/
{
  "motivo": "Exceso de inasistencias"
}

# Desbloquear usuario (admin)
POST /api/v1/usuarios/{id}/desbloquear/
{
  "motivo": "Usuario se comprometió a asistir"
}
```

**Profesionales:**
```http
# Listar profesionales activos
GET /api/v1/profesionales/
Response:
[
  {
    "id": 1,
    "nombre_completo": "Dr. Juan Pérez",
    "especialidad": "Medicina General",
    "titulo_profesional": "Médico Cirujano",
    "registro_profesional": "12345",
    "duracion_cita_minutos": 30,
    "activo_para_citas": true
  }
]

# Ver disponibilidad de un profesional
GET /api/v1/profesionales/{id}/disponibilidad/
Response:
[
  {
    "id": 1,
    "dia_semana": 0,  // 0=Lunes, 6=Domingo
    "hora_inicio": "09:00:00",
    "hora_fin": "13:00:00",
    "activo": true
  }
]

# Horarios disponibles por fecha
POST /api/v1/profesionales/{id}/horarios_disponibles/
{
  "fecha": "2025-12-15"
}
Response:
[
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  // ...
]
```

**Citas:**
```http
# Listar mis citas
GET /api/v1/citas/
Query params:
  - fecha: 2025-12-15
  - estado: AGENDADA|CONFIRMADA|COMPLETADA|CANCELADA|NO_ASISTIO

# Crear cita
POST /api/v1/citas/
{
  "profesional": 1,
  "fecha_hora": "2025-12-15T10:00:00",
  "motivo_consulta": "Control de rutina"
}

# Ver detalle de cita
GET /api/v1/citas/{id}/

# Cancelar cita
POST /api/v1/citas/{id}/cancelar/
{
  "motivo_cancelacion": "Tengo un imprevisto"
}

# Confirmar asistencia
POST /api/v1/citas/{id}/confirmar/

# Completar cita (profesional)
POST /api/v1/citas/{id}/completar/
{
  "notas_profesional": "Paciente en buen estado..."
}

# Marcar no asistió (profesional/admin)
POST /api/v1/citas/{id}/marcar_no_asistio/

# Estadísticas (admin)
GET /api/v1/citas/estadisticas/
Query params:
  - fecha_desde: 2025-01-01
  - fecha_hasta: 2025-12-31
```

**Disponibilidad:**
```http
# Listar mi disponibilidad (profesional)
GET /api/v1/disponibilidad/

# Crear horario
POST /api/v1/disponibilidad/
{
  "dia_semana": 0,  // 0=Lunes
  "hora_inicio": "09:00",
  "hora_fin": "13:00",
  "activo": true
}

# Actualizar horario
PUT /api/v1/disponibilidad/{id}/
{
  "hora_inicio": "08:00",
  "hora_fin": "14:00"
}

# Eliminar horario
DELETE /api/v1/disponibilidad/{id}/
```

---

### Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | Operación exitosa (GET, PUT) |
| 201 | Created | Recurso creado (POST) |
| 204 | No Content | Eliminación exitosa (DELETE) |
| 400 | Bad Request | Datos inválidos en request |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | Sin permisos para la acción |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: horario ocupado) |
| 500 | Server Error | Error interno del servidor |

---

### Flujo de Autenticación JWT

Usuario envía credenciales
↓
Backend valida en base de datos
↓
Si válido, genera 2 tokens:

Access Token (15 min)
Refresh Token (1 día)
↓


Frontend guarda en Zustand (memoria)
↓
Cada request incluye: Authorization: Bearer <token>
↓
Middleware valida token
↓
Si token expirado (401):

Frontend interceptor detecta
Envía Refresh Token
Obtiene nuevo Access Token
Reintenta request original
↓


Si Refresh Token expirado:

Redirect a login
Usuario debe autenticarse nuevamente




**Implementación en Frontend (Axios Interceptor):**
```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post('/api/v1/auth/refresh/', {
          refresh: refreshToken
        });

        const { access } = response.data;
        useAuthStore.getState().setAccessToken(access);

        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 📋 Requerimientos Funcionales

### RF Implementados

| ID | Requerimiento | Estado | Descripción |
|----|---------------|--------|-------------|
| RF-01 | Registro de usuarios | ✅ | Sistema de registro con validación de RUT |
| RF-02 | Autenticación JWT | ✅ | Login con tokens access y refresh |
| RF-03 | Agendar citas | ✅ | Flujo de 3 pasos con validación en tiempo real |
| RF-04 | Confirmar citas | ✅ | Paciente confirma asistencia |
| RF-05 | Cancelar citas | ✅ | Hasta 24h antes, con motivo |
| RF-06 | Gestionar disponibilidad | ✅ | CRUD completo de horarios por profesional |
| RF-07 | Control de inasistencias | ✅ | Contador automático al marcar "No Asistió" |
| RF-08 | Bloqueo automático | ✅ | Sistema bloquea tras 3 inasistencias |
| RF-09 | Bloqueo manual (admin) | ✅ | Admin puede bloquear/desbloquear con motivo |
| RF-10 | Gestión de usuarios | ✅ | CRUD completo, filtros, búsqueda |
| RF-11 | Dashboard por rol | ✅ | Diferentes vistas según Paciente/Profesional/Admin |
| RF-12 | Historial de citas | ✅ | Visualización de citas pasadas y futuras |
| RF-13 | Notas médicas | ✅ | Profesional agrega notas post-atención |
| RF-14 | Completar citas | ✅ | Profesional marca como completadas |
| RF-15 | Reportes y estadísticas | ✅ | Dashboar
con métricas en tiempo real |
| RF-16 | Recordatorios automáticos | ✅ | Celery envía recordatorios 24h antes |
| RF-17 | Limpieza automática | ✅ | Cancela citas no confirmadas |
| RF-18 | Validación de disponibilidad | ✅ | Evita dobles reservas |
| RF-19 | Filtros y búsquedas | ✅ | En todas las listas principales |
| RF-20 | Cambio de contraseña | ✅ | Usuario puede cambiar su password |
🔒 Seguridad
Medidas Implementadas
1. Autenticación y Autorización

✅ JWT (JSON Web Tokens)

Access Token: 15 minutos
Refresh Token: 1 día
Almacenamiento en memoria (no localStorage)


✅ Hashing de Contraseñas

Algoritmo: bcrypt
Salt rounds: 12
Nunca se almacenan en texto plano


✅ Permisos por Rol

python  class CitaViewSet(viewsets.ModelViewSet):
      permission_classes = [permissions.IsAuthenticated]
      
      def get_queryset(self):
          if self.request.user.rol == 'PACIENTE':
              return Cita.objects.filter(paciente=self.request.user)
          elif self.request.user.rol == 'PROFESIONAL':
              return Cita.objects.filter(profesional=self.request.user.perfil_profesional)
          return Cita.objects.all()  # Admin ve todo
2. Protección contra Ataques

✅ SQL Injection

Django ORM parametriza automáticamente queries
Nunca se ejecuta SQL directo


✅ XSS (Cross-Site Scripting)

React escapa automáticamente el HTML
DOMPurify para contenido HTML si fuera necesario


✅ CSRF (Cross-Site Request Forgery)

Django CSRF middleware activado
Token CSRF en formularios



python  MIDDLEWARE = [
      'django.middleware.csrf.CsrfViewMiddleware',
      # ...
  ]

✅ CORS (Cross-Origin Resource Sharing)

Configuración estricta de orígenes permitidos



python  CORS_ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
  ]
  CORS_ALLOW_CREDENTIALS = True
3. Validaciones

✅ Backend (Django)

python  class UsuarioSerializer(serializers.ModelSerializer):
      def validate_rut(self, value):
          # Validación de formato RUT chileno
          if not validar_rut_chileno(value):
              raise serializers.ValidationError("RUT inválido")
          return value
      
      def validate_password(self, value):
          # Mínimo 8 caracteres, etc.
          if len(value) < 8:
              raise serializers.ValidationError("Contraseña muy corta")
          return value

✅ Frontend (React)

javascript  const validarRUT = (rut) => {
      const regex = /^\d{7,8}-[\dkK]$/;
      return regex.test(rut);
  };
4. Rate Limiting
python# Futuro: Django REST Framework Throttling
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
5. HTTPS en Producción
python# settings.py (producción)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
```

---

## 🏃 Metodología de Desarrollo

### Scrum Aplicado

El proyecto siguió la metodología **Scrum** con las siguientes características:

#### Roles
- **Product Owner**: Equipo de desarrollo (auto-gestionado)
- **Scrum Master**: Rotativo entre los miembros
- **Development Team**: Sebastián Acosta, Erick Tapia

#### Sprints
**Sprint Duration**: 2 semanas

| Sprint | Duración | Objetivo | User Stories |
|--------|----------|----------|--------------|
| **Sprint 1** | 2 semanas | Core de autenticación y agendamiento | HU-001, HU-004 |
| **Sprint 2** | 2 semanas | Gestión de citas y notificaciones | HU-002, HU-005 |
| **Sprint 3** | 2 semanas | Panel administrativo y reportes | HU-003 |
| **Sprint 4** | 1 semana | Docker, Redis, Celery | - |

#### Product Backlog (Priorización MoSCoW)

| ID | Historia de Usuario | Prioridad | Puntos | Estado |
|----|---------------------|-----------|--------|--------|
| HU-001 | Agendar, consultar y cancelar citas (Paciente) | **Must Have** | 13 | ✅ Completado |
| HU-002 | Gestionar agendas y controlar inasistencias (Admin) | **Must Have** | 13 | ✅ Completado |
| HU-003 | Gestionar disponibilidad y visualizar agenda (Profesional) | **Must Have** | 8 | ✅ Completado |
| HU-004 | Validar disponibilidad en tiempo real | **Must Have** | 8 | ✅ Completado |
| HU-005 | Enviar notificaciones automáticas | **Should Have** | 5 | ✅ Completado |
| HU-006 | Exportar reportes a PDF/Excel | **Could Have** | 5 | ⏳ Pendiente |
| HU-007 | Integración con sistema de pagos | **Won't Have** | - | ❌ Fuera de alcance |

#### Estimación (Planning Poker)
- Escala Fibonacci: 1, 2, 3, 5, 8, 13, 21
- Criterios:
  - Complejidad técnica
  - Esfuerzo requerido
  - Incertidumbre
  - Dependencias

#### Ceremonies

**Sprint Planning** (4 horas):
- Selección de User Stories del Product Backlog
- Descomposición en tareas técnicas
- Estimación en puntos de historia
- Definición de Sprint Goal

**Daily Standup** (15 minutos):
- ¿Qué hice ayer?
- ¿Qué haré hoy?
- ¿Hay impedimentos?

**Sprint Review** (2 horas):
- Demo al "cliente" (profesores)
- Feedback y ajustes
- Actualización del Product Backlog

**Sprint Retrospective** (1.5 horas):
- ¿Qué salió bien?
- ¿Qué mejorar?
- Acciones de mejora para próximo sprint

#### Definition of Done (DoD)

✅ Código desarrollado y funcional  
✅ Pruebas unitarias pasando (>80% cobertura)  
✅ Código revisado (peer review)  
✅ Documentación técnica actualizada  
✅ Sin bugs críticos  
✅ Desplegado en ambiente de desarrollo  
✅ Validado por el equipo  

---

## 🧪 Pruebas y Testing

### Estrategia de Pruebas
```
Pirámide de Testing
     /\
    /UI\        ← Pocas, lentas, caras
   /────\
  / API  \      ← Medianas, rápidas
 /────────\
/  UNIT    \    ← Muchas, muy rápidas, baratas
──────────────
1. Pruebas Unitarias (Unit Tests)
Backend - Django Tests:
python# backend/apps/usuarios/tests.py
from django.test import TestCase
from apps.usuarios.models import Usuario

class UsuarioModelTest(TestCase):
    def setUp(self):
        self.usuario = Usuario.objects.create_user(
            rut='12345678-9',
            email='test@example.com',
            password='testpass123',
            nombre='Test',
            apellido='User'
        )
    
    def test_usuario_creation(self):
        """Test que un usuario se crea correctamente"""
        self.assertEqual(self.usuario.rut, '12345678-9')
        self.assertEqual(self.usuario.email, 'test@example.com')
        self.assertFalse(self.usuario.bloqueado)
    
    def test_incrementar_inasistencias(self):
        """Test que el contador de inasistencias se incrementa"""
        self.assertEqual(self.usuario.contador_inasistencias, 0)
        self.usuario.incrementar_inasistencias()
        self.assertEqual(self.usuario.contador_inasistencias, 1)
    
    def test_bloqueo_automatico(self):
        """Test que se bloquea tras 3 inasistencias"""
        for _ in range(3):
            self.usuario.incrementar_inasistencias()
        self.assertTrue(self.usuario.bloqueado)
Ejecutar pruebas:
bashdocker-compose exec backend python manage.py test
2. Pruebas de Integración (API Tests)
python# backend/apps/citas/tests.py
from rest_framework.test import APITestCase
from rest_framework import status

class CitaAPITest(APITestCase):
    def setUp(self):
        # Crear usuario y obtener token
        self.paciente = Usuario.objects.create_user(...)
        self.token = self.get_token(self.paciente)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_crear_cita(self):
        """Test que un paciente puede crear una cita"""
        data = {
            'profesional': self.profesional.id,
            'fecha_hora': '2025-12-15T10:00:00',
            'motivo_consulta': 'Control'
        }
        response = self.client.post('/api/v1/citas/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_no_puede_agendar_horario_ocupado(self):
        """Test que no permite doble reserva"""
        # Primera cita
        Cita.objects.create(...)
        
        # Intentar segunda cita en mismo horario
        data = {...}
        response = self.client.post('/api/v1/citas/', data)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
3. Matriz de Casos de Prueba
IDCaso de PruebaEntradaResultado EsperadoEstadoCP-001Login exitosoRUT y password correctosToken JWT generado, redirect a dashboard✅CP-002Login fallidoPassword incorrectoError 401, mensaje "Credenciales inválidas"✅CP-003Token expiradoRequest con token vencidoAuto-refresh, request exitoso✅CP-004Agendar cita válidaProfesional, fecha, hora disponiblesCita creada, estado AGENDADA✅CP-005Agendar horario ocupadoHorario ya reservadoError 409, mensaje "Horario no disponible"✅CP-006Cancelar cita (>24h)Cita 2 días en el futuroEstado cambia a CANCELADA✅CP-007Cancelar cita (<24h)Cita en 12 horasError 400, "No se puede cancelar"✅CP-008Marcar No AsistióProfesional marca inasistenciaContador +1, si =3 → bloqueo✅CP-009Bloqueo manual (admin)Admin bloquea con motivoUsuario.bloqueado=True✅CP-010Usuario bloqueado intenta agendarUsuario bloqueado + datos válidosError 403, "Usuario bloqueado"✅
4. Pruebas de Carga (Futuro)
python# Usar Locust para simular usuarios concurrentes
from locust import HttpUser, task

class CitasLoadTest(HttpUser):
    @task
    def agendar_cita(self):
        self.client.post("/api/v1/citas/", json={
            "profesional": 1,
            "fecha_hora": "2025-12-15T10:00:00",
            "motivo_consulta": "Test"
        })
Ejecutar:
bashlocust -f locustfile.py --host=http://localhost:8000
```

---

## 🚀 Despliegue

### Arquitectura de Producción
```
Internet
   ↓
[Cloudflare CDN] (opcional)
   ↓
[Load Balancer - Nginx]
   ↓
┌──────────────┬──────────────┐
│              │              │
[Frontend]  [Backend API]  [Static Files]
   ↓              ↓
[PostgreSQL] [Redis] [Celery]
   ↓              ↓
[Backups]    [Monitoring]
Opciones de Despliegue
1. Render.com (Recomendado para demo)
Ventajas:

✅ Free tier disponible
✅ Deploy automático desde GitHub
✅ PostgreSQL incluído
✅ SSL gratis

Pasos:

Crear cuenta en https://render.com
Conectar repo de GitHub
Crear Web Service para backend
Crear Static Site para frontend
Crear PostgreSQL database
Configurar variables de entorno

2. Railway.app
Ventajas:

✅ Deploy con un click
✅ $5 de crédito gratis
✅ Redis incluído

3. AWS (Producción real)
Servicios necesarios:

EC2 para backend
S3 + CloudFront para frontend
RDS para PostgreSQL
ElastiCache para Redis
ECS para Celery
Route 53 para DNS

4. Docker en VPS
Proveedores:

DigitalOcean ($5/mes)
Linode
Vultr

Setup:
bash# En el servidor
git clone https://github.com/Naicoby/SGC-MEDICO.git
cd SGC-MEDICO

# Variables de entorno producción
cat > .env << EOF
DEBUG=False
SECRET_KEY=<generar-uno-seguro>
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=tudominio.com
EOF

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Checklist Pre-Despliegue

- [ ] Cambiar `DEBUG=False` en settings.py
- [ ] Generar `SECRET_KEY` nuevo (no usar el de desarrollo)
- [ ] Configurar `ALLOWED_HOSTS` con dominio real
- [ ] Habilitar HTTPS (SSL certificate)
- [ ] Configurar backups automáticos de DB
- [ ] Setup de logging y monitoring
- [ ] Configurar rate limiting
- [ ] Ejecutar `collectstatic` para archivos estáticos
- [ ] Probar en ambiente staging primero

---

## 👨‍💻 Autores

**Sebastián Acosta**  
Desarrollador Full Stack  
📧 Email: [sebastian.acosta@example.com]  
🔗 GitHub: [@sebastianacosta](https://github.com/sebastianacosta)

**Erick Tapia**  
Desarrollador Full Stack  
📧 Email: [erick.tapia@example.com]  
🔗 GitHub: [@Naicoby](https://github.com/Naicoby)

---

**Proyecto de Titulación**  
**Analista Programador** - 2025  
**Instituto:** [Nombre de la Institución]  
**Profesor Guía:** [Nombre del Profesor]

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para la carrera de Analista Programador.

**Restricciones:**
- ❌ No disponible para uso comercial
- ✅ Disponible para fines educativos y referencia
- ✅ Se permite clonar y estudiar el código
- ❌ Requiere atribución a los autores originales

---

## 🙏 Agradecimientos

- **Profesores de Ingeniería de Software** por la guía y feedback constante
- **Clínica de Salud** por permitir usar su caso como estudio
- **Comunidad de Django** por la excelente documentación
- **Comunidad de React** por los recursos educativos
- **Stack Overflow** por resolver miles de dudas

---

## 📞 Contacto y Soporte

Para consultas sobre este proyecto:

- 📧 **Email**: Naicoby777@gmail,com
- 🐛 **Issues**: https://github.com/Naicoby/SGC-MEDICO/issues
- 📖 **Wiki**: https://github.com/Naicoby/SGC-MEDICO/wiki

---

## 🗺️ Roadmap Futuro

### Versión 2.0 (Futuro)
- [ ] Integración con sistema de pagos (WebPay, Flow)
- [ ] Videoconsultas integradas (Jitsi, Zoom API)
- [ ] App móvil nativa (React Native)
- [ ] Integración con sistema de fichas clínicas electrónicas
- [ ] Exportación de reportes a PDF y Excel
- [ ] Sistema de evaluaciones y reviews
- [ ] Multi-tenancy (múltiples clínicas)
- [ ] Internacionalización (i18n)
- [ ] Dashboard con gráficos avanzados (Chart.js, D3.js)
- [ ] Notificaciones push en tiempo real (WebSockets)

---

**⭐ Si este proyecto te ayudó, considera darle una estrella en GitHub**

---

**🎓 Proyecto de Titulación - Analista Programador 2025**

**Estado del Proyecto:** ✅ COMPLETADO Y FUNCIONAL

**Última actualización:** Diciembre 2025

---

## 📊 Métricas del Proyecto
```
┌─────────────────────────────────────────┐
│   ESTADÍSTICAS FINALES DEL PROYECTO    │
├─────────────────────────────────────────┤
│ Líneas de código total:     ~7,000      │
│ Archivos creados:           60+         │
│ Endpoints API:              35+         │
│ Páginas frontend:           18          │
│ Modelos de datos:           7           │
│ Tareas asíncronas:          3           │
│ Componentes React:          25+         │
│ Pruebas unitarias:          40+         │
│ Cobertura de tests:         75%         │
│ Tiempo de desarrollo:       3 meses     │
│ Sprints completados:        4           │
│ User Stories:               20          │
└─────────────────────────────────────────┘