from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Cita
import logging

logger = logging.getLogger(__name__)

@shared_task(name='apps.citas.tasks.enviar_recordatorios_citas')
def enviar_recordatorios_citas():
    """
    Envía recordatorios de citas programadas para el día siguiente.
    Se ejecuta todos los días a las 9:00 AM.
    """
    logger.info("Iniciando envío de recordatorios de citas...")
    
    manana = timezone.now().date() + timedelta(days=1)
    
    # Buscar citas confirmadas o agendadas para mañana
    citas_manana = Cita.objects.filter(
        fecha_hora__date=manana,
        estado__in=['AGENDADA', 'CONFIRMADA']
    ).select_related('paciente', 'profesional')
    
    enviados = 0
    errores = 0
    
    for cita in citas_manana:
        try:
            # Aquí iría la lógica de envío de email/SMS
            # Por ahora solo registramos en logs
            logger.info(
                f"Recordatorio: Cita #{cita.id} - "
                f"Paciente: {cita.paciente.get_full_name()} - "
                f"Profesional: {cita.profesional.nombre_completo} - "
                f"Hora: {cita.fecha_hora.strftime('%H:%M')}"
            )
            enviados += 1
            
            # TODO: Implementar envío real de email/SMS
            # enviar_email_recordatorio(cita)
            # enviar_sms_recordatorio(cita)
            
        except Exception as e:
            logger.error(f"Error enviando recordatorio cita #{cita.id}: {str(e)}")
            errores += 1
    
    logger.info(
        f"Recordatorios completados. Enviados: {enviados}, Errores: {errores}"
    )
    
    return {
        'enviados': enviados,
        'errores': errores,
        'total': citas_manana.count()
    }


@shared_task(name='apps.citas.tasks.limpiar_citas_no_confirmadas')
def limpiar_citas_no_confirmadas():
    """
    Cancela automáticamente citas no confirmadas 24 horas antes.
    Se ejecuta todos los días a las 00:00.
    """
    logger.info("Iniciando limpieza de citas no confirmadas...")
    
    limite = timezone.now() + timedelta(hours=24)
    
    # Buscar citas agendadas (no confirmadas) que vencen en menos de 24h
    citas_vencidas = Cita.objects.filter(
        fecha_hora__lte=limite,
        fecha_hora__gte=timezone.now(),
        estado='AGENDADA',
        confirmada_por_paciente=False
    )
    
    canceladas = 0
    
    for cita in citas_vencidas:
        try:
            cita.estado = 'CANCELADA'
            cita.motivo_cancelacion = 'Cancelación automática por falta de confirmación'
            cita.fecha_cancelacion = timezone.now()
            cita.save()
            
            logger.info(
                f"Cita #{cita.id} cancelada automáticamente - "
                f"Paciente: {cita.paciente.get_full_name()}"
            )
            canceladas += 1
            
        except Exception as e:
            logger.error(f"Error cancelando cita #{cita.id}: {str(e)}")
    
    logger.info(f"Limpieza completada. Citas canceladas: {canceladas}")
    
    return {
        'canceladas': canceladas,
        'total': citas_vencidas.count()
    }


@shared_task(name='apps.citas.tasks.generar_reporte_mensual')
def generar_reporte_mensual():
    """
    Genera reporte estadístico mensual.
    Tarea manual que se puede ejecutar desde el admin.
    """
    logger.info("Generando reporte mensual...")
    
    primer_dia_mes = timezone.now().replace(day=1)
    
    citas_mes = Cita.objects.filter(
        fecha_hora__gte=primer_dia_mes
    )
    
    estadisticas = {
        'total_citas': citas_mes.count(),
        'completadas': citas_mes.filter(estado='COMPLETADA').count(),
        'canceladas': citas_mes.filter(estado='CANCELADA').count(),
        'no_asistio': citas_mes.filter(estado='NO_ASISTIO').count(),
    }
    
    logger.info(f"Reporte generado: {estadisticas}")
    
    return estadisticas