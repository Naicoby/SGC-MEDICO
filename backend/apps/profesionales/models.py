from django.db import models
from apps.usuarios.models import Usuario

class Profesional(models.Model):
    """
    Modelo que extiende Usuario para profesionales de la salud
    Hereda de Usuario mediante relación OneToOne
    """
    
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='perfil_profesional',
        limit_choices_to={'rol': 'PROFESIONAL'}
    )
    
    # Información profesional
    especialidad = models.CharField(max_length=100, verbose_name='Especialidad')
    registro_profesional = models.CharField(max_length=50, unique=True, verbose_name='N° Registro Profesional')
    anos_experiencia = models.IntegerField(verbose_name='Años de Experiencia')
    titulo_profesional = models.CharField(max_length=150, verbose_name='Título Profesional')
    
    # Disponibilidad
    activo_para_citas = models.BooleanField(default=True, verbose_name='Activo para Citas')
    duracion_cita_minutos = models.IntegerField(default=30, verbose_name='Duración de Cita (min)')
    
    # Información adicional
    biografia = models.TextField(blank=True, verbose_name='Biografía')
    foto = models.ImageField(upload_to='profesionales/', blank=True, null=True, verbose_name='Foto')
    
    # Metadata
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name='Última Actualización')
    
    class Meta:
        verbose_name = 'Profesional'
        verbose_name_plural = 'Profesionales'
        ordering = ['usuario__nombre']
    
    def __str__(self):
        return f"Dr(a). {self.usuario.get_full_name()} - {self.especialidad}"
    
    def get_disponibilidad_semanal(self):
        """Retorna la disponibilidad semanal del profesional"""
        return self.disponibilidad.all()


class DisponibilidadProfesional(models.Model):
    """
    Define los horarios de disponibilidad de un profesional
    """
    
    DIAS_SEMANA = (
        (0, 'Lunes'),
        (1, 'Martes'),
        (2, 'Miércoles'),
        (3, 'Jueves'),
        (4, 'Viernes'),
        (5, 'Sábado'),
        (6, 'Domingo'),
    )
    
    profesional = models.ForeignKey(
        Profesional, 
        on_delete=models.CASCADE, 
        related_name='disponibilidad'
    )
    dia_semana = models.IntegerField(choices=DIAS_SEMANA, verbose_name='Día de la Semana')
    hora_inicio = models.TimeField(verbose_name='Hora de Inicio')
    hora_fin = models.TimeField(verbose_name='Hora de Fin')
    activo = models.BooleanField(default=True, verbose_name='Activo')
    
    class Meta:
        verbose_name = 'Disponibilidad'
        verbose_name_plural = 'Disponibilidades'
        ordering = ['dia_semana', 'hora_inicio']
        unique_together = ['profesional', 'dia_semana', 'hora_inicio']
    
    def __str__(self):
        return f"{self.profesional} - {self.get_dia_semana_display()} {self.hora_inicio}-{self.hora_fin}"


class BloqueoHorario(models.Model):
    """
    Bloqueos específicos de horarios (vacaciones, permisos, etc.)
    """
    
    MOTIVOS = (
        ('VACACIONES', 'Vacaciones'),
        ('PERMISO', 'Permiso Médico'),
        ('CAPACITACION', 'Capacitación'),
        ('ADMINISTRATIVO', 'Tarea Administrativa'),
        ('OTRO', 'Otro'),
    )
    
    profesional = models.ForeignKey(
        Profesional, 
        on_delete=models.CASCADE, 
        related_name='bloqueos'
    )
    fecha_inicio = models.DateTimeField(verbose_name='Fecha y Hora de Inicio')
    fecha_fin = models.DateTimeField(verbose_name='Fecha y Hora de Fin')
    motivo = models.CharField(max_length=20, choices=MOTIVOS, verbose_name='Motivo')
    descripcion = models.TextField(blank=True, verbose_name='Descripción')
    
    # Metadata
    creado_por = models.ForeignKey(
        Usuario, 
        on_delete=models.SET_NULL, 
        null=True,
        verbose_name='Creado Por'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    
    class Meta:
        verbose_name = 'Bloqueo de Horario'
        verbose_name_plural = 'Bloqueos de Horarios'
        ordering = ['-fecha_inicio']
    
    def __str__(self):
        return f"{self.profesional} - {self.get_motivo_display()} ({self.fecha_inicio.strftime('%d/%m/%Y')})"