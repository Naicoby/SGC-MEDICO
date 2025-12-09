from django.db import models
from django.utils import timezone
from django.conf import settings
from apps.usuarios.models import Usuario
from apps.profesionales.models import Profesional
from datetime import timedelta

class Cita(models.Model):
    """
    Modelo principal para el agendamiento de citas médicas
    """
    
    ESTADOS = (
        ('AGENDADA', 'Agendada'),
        ('CONFIRMADA', 'Confirmada'),
        ('EN_CURSO', 'En Curso'),
        ('COMPLETADA', 'Completada'),
        ('CANCELADA', 'Cancelada'),
        ('NO_ASISTIO', 'No Asistió'),
    )
    
    # Relaciones principales
    paciente = models.ForeignKey(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='citas',
        limit_choices_to={'rol': 'PACIENTE'}
    )
    profesional = models.ForeignKey(
        Profesional, 
        on_delete=models.CASCADE, 
        related_name='citas'
    )
    
    # Información de la cita
    fecha_hora = models.DateTimeField(verbose_name='Fecha y Hora')
    duracion_minutos = models.IntegerField(default=30, verbose_name='Duración (minutos)')
    motivo_consulta = models.TextField(verbose_name='Motivo de Consulta')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='AGENDADA', verbose_name='Estado')
    
    # Confirmación y recordatorios
    confirmada_por_paciente = models.BooleanField(default=False, verbose_name='Confirmada por Paciente')
    fecha_confirmacion = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Confirmación')
    recordatorio_enviado = models.BooleanField(default=False, verbose_name='Recordatorio Enviado')
    fecha_recordatorio = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Recordatorio')
    
    # Cancelación
    fecha_cancelacion = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Cancelación')
    motivo_cancelacion = models.TextField(blank=True, verbose_name='Motivo de Cancelación')
    cancelada_por = models.ForeignKey(
        Usuario, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='citas_canceladas',
        verbose_name='Cancelada Por'
    )
    
    # Observaciones
    observaciones = models.TextField(blank=True, verbose_name='Observaciones')
    notas_profesional = models.TextField(blank=True, verbose_name='Notas del Profesional')
    
    # Metadata
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name='Última Actualización')
    
    class Meta:
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['-fecha_hora']
        unique_together = ['profesional', 'fecha_hora']
    
    def __str__(self):
        return f"Cita: {self.paciente.get_full_name()} - {self.profesional} - {self.fecha_hora.strftime('%d/%m/%Y %H:%M')}"
    
    def save(self, *args, **kwargs):
        """Override save para validaciones"""
        # Si se confirma la cita, registrar fecha
        if self.confirmada_por_paciente and not self.fecha_confirmacion:
            self.fecha_confirmacion = timezone.now()
        
        super().save(*args, **kwargs)
    
    def puede_cancelar(self):
        """Verifica si la cita puede ser cancelada"""
        if self.estado in ['COMPLETADA', 'NO_ASISTIO', 'CANCELADA']:
            return False
        
        # Verificar tiempo de anticipación
        horas_anticipacion = settings.HORAS_ANTICIPACION_CANCELACION
        tiempo_minimo = self.fecha_hora - timedelta(hours=horas_anticipacion)
        
        return timezone.now() < tiempo_minimo
    
    def cancelar(self, usuario, motivo=""):
        """Cancela la cita"""
        if not self.puede_cancelar():
            raise ValueError("No se puede cancelar esta cita")
        
        self.estado = 'CANCELADA'
        self.fecha_cancelacion = timezone.now()
        self.motivo_cancelacion = motivo
        self.cancelada_por = usuario
        self.save()
    
    def marcar_no_asistio(self):
        """Marca la cita como no asistida e incrementa contador de inasistencias"""
        self.estado = 'NO_ASISTIO'
        self.save()
        
        # Incrementar contador de inasistencias del paciente
        self.paciente.incrementar_inasistencias()
        
        # Registrar en historial de bloqueos si se bloqueó
        if self.paciente.bloqueado:
            from apps.usuarios.models import HistorialBloqueo
            HistorialBloqueo.objects.create(
                usuario=self.paciente,
                motivo=f"Bloqueo automático por {self.paciente.contador_inasistencias} inasistencias",
                inasistencias_acumuladas=self.paciente.contador_inasistencias
            )
    
    def confirmar_cita(self):
        """Confirma la cita por parte del paciente"""
        self.confirmada_por_paciente = True
        self.fecha_confirmacion = timezone.now()
        self.estado = 'CONFIRMADA'
        self.save()
    
    def get_hora_fin(self):
        """Retorna la hora de fin de la cita"""
        return self.fecha_hora + timedelta(minutes=self.duracion_minutos)
    
    def es_hoy(self):
        """Verifica si la cita es hoy"""
        return self.fecha_hora.date() == timezone.now().date()
    
    def requiere_recordatorio(self):
        """Verifica si requiere envío de recordatorio"""
        if self.recordatorio_enviado or self.estado not in ['AGENDADA', 'CONFIRMADA']:
            return False
        
        # Verificar si falta 24 horas o menos
        tiempo_restante = self.fecha_hora - timezone.now()
        return timedelta(hours=23) <= tiempo_restante <= timedelta(hours=25)


class HistorialCita(models.Model):
    """
    Registro de cambios en el estado de una cita
    """
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE, related_name='historial')
    estado_anterior = models.CharField(max_length=20, verbose_name='Estado Anterior')
    estado_nuevo = models.CharField(max_length=20, verbose_name='Estado Nuevo')
    fecha_cambio = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Cambio')
    modificado_por = models.ForeignKey(
        Usuario, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name='Modificado Por'
    )
    observaciones = models.TextField(blank=True, verbose_name='Observaciones')
    
    class Meta:
        verbose_name = 'Historial de Cita'
        verbose_name_plural = 'Historiales de Citas'
        ordering = ['-fecha_cambio']
    
    def __str__(self):
        return f"{self.cita} - {self.estado_anterior} → {self.estado_nuevo}"