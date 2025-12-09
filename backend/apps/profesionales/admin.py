from django.contrib import admin
from .models import Profesional, DisponibilidadProfesional, BloqueoHorario

@admin.register(Profesional)
class ProfesionalAdmin(admin.ModelAdmin):
    """Administración del modelo Profesional"""
    
    list_display = ('usuario', 'especialidad', 'titulo_profesional', 'activo_para_citas')
    list_filter = ('especialidad', 'activo_para_citas')
    search_fields = ('usuario__rut', 'usuario__nombre', 'usuario__apellido', 'especialidad', 'titulo_profesional')
    
    fieldsets = (
        ('Información del Profesional', {
            'fields': ('usuario', 'especialidad', 'titulo_profesional', 'registro_profesional', 'anos_experiencia')
        }),
        ('Horarios y Disponibilidad', {
            'fields': ('duracion_cita_minutos', 'activo_para_citas')
        }),
        ('Información Adicional', {
            'fields': ('biografia', 'foto'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimiza las consultas con select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('usuario')


@admin.register(DisponibilidadProfesional)
class DisponibilidadProfesionalAdmin(admin.ModelAdmin):
    """Administración de disponibilidad de profesionales"""
    
    list_display = ('profesional', 'dia_semana', 'hora_inicio', 'hora_fin', 'activo')
    list_filter = ('dia_semana', 'activo', 'profesional')
    search_fields = ('profesional__usuario__nombre', 'profesional__usuario__apellido')
    
    fieldsets = (
        ('Profesional', {
            'fields': ('profesional',)
        }),
        ('Horario', {
            'fields': ('dia_semana', 'hora_inicio', 'hora_fin', 'activo')
        }),
    )
    
    def get_queryset(self, request):
        """Optimiza las consultas"""
        qs = super().get_queryset(request)
        return qs.select_related('profesional__usuario')


@admin.register(BloqueoHorario)
class BloqueoHorarioAdmin(admin.ModelAdmin):
    """Administración de bloqueos de horario"""
    
    list_display = ('profesional', 'fecha_inicio', 'fecha_fin', 'motivo', 'descripcion_corta', 'creado_por')
    list_filter = ('motivo', 'fecha_inicio', 'profesional')
    search_fields = ('profesional__usuario__nombre', 'profesional__usuario__apellido', 'descripcion')
    date_hierarchy = 'fecha_inicio'
    
    fieldsets = (
        ('Profesional', {
            'fields': ('profesional',)
        }),
        ('Período de Bloqueo', {
            'fields': ('fecha_inicio', 'fecha_fin')
        }),
        ('Detalles', {
            'fields': ('motivo', 'descripcion', 'creado_por')
        }),
    )
    
    def descripcion_corta(self, obj):
        """Muestra un resumen de la descripción"""
        return obj.descripcion[:50] + '...' if len(obj.descripcion) > 50 else obj.descripcion
    descripcion_corta.short_description = 'Descripción'
    
    def get_queryset(self, request):
        """Optimiza las consultas"""
        qs = super().get_queryset(request)
        return qs.select_related('profesional__usuario', 'creado_por')