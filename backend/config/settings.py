# -*- coding: utf-8 -*-
"""
Configuración de Django para el proyecto SGC.
"""
import os
from pathlib import Path
from pathlib import Path
from decouple import config
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# ==============================================================================
# 1. CONFIGURACIÓN DE SEGURIDAD (Se recomienda usar un archivo .env)
# ==============================================================================

# WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

# Hosts permitidos, leídos del .env
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='127.0.0.1,localhost').split(',')


# ==============================================================================
# 2. INSTALLED APPLICATIONS
# ==============================================================================

INSTALLED_APPS = [
    # Django Apps por defecto
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 3rd Party Apps
    'rest_framework',
    'corsheaders',
    'django_filters',
    
    # Celery & Background Tasks (para notificaciones automáticas - HU-005-NOTIF)
    'celery',
    
    # SGC - Aplicaciones Locales (apps/)
    'apps.usuarios',
    'apps.profesionales',
    'apps.citas',
    'apps.notificaciones',
    'apps.reportes',
]

# ==============================================================================
# 3. MIDDLEWARE
# ==============================================================================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS debe ir antes de CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# ==============================================================================
# 4. BASE DE DATOS
# ==============================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'sgc_db'),
        'USER': os.environ.get('POSTGRES_USER', 'sgc_user'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'sgc_password123'),
        'HOST': os.environ.get('DB_HOST', 'db'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}


# ==============================================================================
# 5. AUTENTICACIÓN Y MODELO DE USUARIO PERSONALIZADO
# ==============================================================================

# Define tu modelo de usuario personalizado para usar RUT como identificador principal
AUTH_USER_MODEL = 'usuarios.Usuario'

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]


# ==============================================================================
# 6. INTERNACIONALIZACIÓN Y ZONA HORARIA
# ==============================================================================

LANGUAGE_CODE = 'es-cl' # Español de Chile

TIME_ZONE = 'America/Santiago'

USE_I18N = True

USE_TZ = True


# ==============================================================================
# 7. ARCHIVOS ESTÁTICOS Y MEDIA
# ==============================================================================

STATIC_URL = 'static/'

# Directorio base de archivos estáticos (para desarrollo)
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Configuración de Archivos Media (Imágenes de perfil, etc.)
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'


# ==============================================================================
# 8. DJANGO REST FRAMEWORK & CORS
# ==============================================================================

# Permite peticiones AJAX desde cualquier dominio.
# CORS_ALLOW_ALL_ORIGINS = True # Se recomienda usar la lista explícita en producción

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://frontend:5173",
]

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    # JWT Authentication es la clase por defecto (RNF-01: Autenticación basada en tokens)
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}


# ==============================================================================
# 9. CONFIGURACIÓN DE CELERY
# ==============================================================================

# Broker URL (Se usará Redis)
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'America/Santiago'
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 minutos

# ==============================================================================
# 10. CONFIGURACIÓN LOCAL DEL PROYECTO (SGC)
# ==============================================================================
# ==============================================================================
# 10. CONFIGURACIÓN LOCAL DEL PROYECTO (SGC)
# ==============================================================================

# Máximo de inasistencias antes de bloquear al paciente (RNF-02)
MAX_INASISTENCIAS = 3

# Horas mínimas de anticipación para cancelar una cita (RNF)
HORAS_ANTICIPACION_CANCELACION = 24

# Duración por defecto de una cita en minutos
DURACION_CITA_DEFAULT = 30

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Máximo de inasistencias antes de bloquear al paciente (RNF-02)
MAX_INASISTENCIAS = 3

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'