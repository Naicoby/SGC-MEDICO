import os
from celery import Celery
from celery.schedules import crontab

# Configurar Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Crear instancia de Celery
app = Celery('sgc_backend')

# Configuración desde Django settings con namespace CELERY
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-descubrir tareas en todas las apps
app.autodiscover_tasks()

# Configurar tareas programadas (Celery Beat)
app.conf.beat_schedule = {
    # Enviar recordatorios cada día a las 9:00 AM
    'enviar-recordatorios-diarios': {
        'task': 'apps.citas.tasks.enviar_recordatorios_citas',
        'schedule': crontab(hour=9, minute=0),  # 9:00 AM todos los días
    },
    # Limpiar citas expiradas cada día a las 00:00
    'limpiar-citas-expiradas': {
        'task': 'apps.citas.tasks.limpiar_citas_no_confirmadas',
        'schedule': crontab(hour=0, minute=0),  # 00:00 todos los días
    },
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')