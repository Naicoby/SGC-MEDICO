from django.contrib import admin
from django.utils.html import format_html
from .models import Cita, HistorialCita

@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    """Administración del modelo Cita"""
    
    list_display = ('id', 'paciente_nombre', 'profesional_nombre', 'fecha_hora', 'estado_badge', 'fecha_creacion')
    list_filter = ('estado', 'fecha_hora', 'profesional', 'confirmada_por_paciente')
    search_fields = ('paciente__rut', 'paciente__nombre', 'paciente__apellido', 
                     'profesional__usuario__nombre', 'profesional__usuario__apellido')
    date_hierarchy = 'fecha_hora'
    ordering = ('-fecha_hora',)
    
    fieldsets = (
        ('Información de la Cita', {
            'fields': ('paciente', 'profesional', 'fecha_hora', 'duracion_minutos')
        }),
        ('Estado y Detalles', {
            'fields': ('estado', 'motivo_consulta', 'observaciones', 'notas_profesional')
        }),
        ('Confirmación', {
            'fields': ('confirmada_por_paciente', 'fecha_confirmacion'),
            'classes': ('collapse',)
        }),
        ('Recordatorios', {
            'fields': ('recordatorio_enviado', 'fecha_recordatorio'),
            'classes': ('collapse',)
        }),
        ('Cancelación', {
            'fields': ('fecha_cancelacion', 'motivo_cancelacion', 'cancelada_por'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion', 'fecha_confirmacion', 'fecha_recordatorio', 'fecha_cancelacion')
    
    actions = ['marcar_completada', 'marcar_cancelada', 'marcar_no_asistio']
    
    def paciente_nombre(self, obj):
        """Muestra el nombre completo del paciente"""
        return obj.paciente.get_full_name()
    paciente_nombre.short_description = 'Paciente'
    
    def profesional_nombre(self, obj):
        """Muestra el nombre completo del profesional"""
        return obj.profesional.usuario.get_full_name()
    profesional_nombre.short_description = 'Profesional'
    
    def estado_badge(self, obj):
        """Muestra el estado con color"""
        colors = {
            'PENDIENTE': 'orange',
            'CONFIRMADA': 'blue',
            'COMPLETADA': 'green',
            'CANCELADA': 'red',
            'NO_ASISTIO': 'darkred',
        }
        color = colors.get(obj.estado, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_estado_display()
        )
    estado_badge.short_description = 'Estado'
    
    def marcar_completada(self, request, queryset):
        """Marca las citas seleccionadas como completadas"""
        count = queryset.filter(estado='CONFIRMADA').update(estado='COMPLETADA')
        self.message_user(request, f'{count} cita(s) marcada(s) como completada(s).')
    marcar_completada.short_description = "Marcar como Completada"
    
    def marcar_cancelada(self, request, queryset):
        """Marca las citas seleccionadas como canceladas"""
        count = queryset.exclude(estado__in=['COMPLETADA', 'NO_ASISTIO']).update(estado='CANCELADA')
        self.message_user(request, f'{count} cita(s) cancelada(s).')
    marcar_cancelada.short_description = "Cancelar citas"
    
    def marcar_no_asistio(self, request, queryset):
        """Marca las citas como no asistidas"""
        count = queryset.filter(estado='CONFIRMADA').update(estado='NO_ASISTIO')
        self.message_user(request, f'{count} cita(s) marcada(s) como No Asistió.')
    marcar_no_asistio.short_description = "Marcar como No Asistió"
    
    def get_queryset(self, request):
        """Optimiza las consultas"""
        qs = super().get_queryset(request)
        return qs.select_related('paciente', 'profesional__usuario', 'cancelada_por')


@admin.register(HistorialCita)
class HistorialCitaAdmin(admin.ModelAdmin):
    """Administración del historial de citas"""
    
    list_display = ('cita', 'estado_anterior', 'estado_nuevo', 'modificado_por', 'fecha_cambio')
    list_filter = ('estado_anterior', 'estado_nuevo', 'fecha_cambio')
    search_fields = ('cita__paciente__rut', 'cita__paciente__nombre', 'observaciones')
    date_hierarchy = 'fecha_cambio'
    readonly_fields = ('fecha_cambio',)
    
    fieldsets = (
        ('Información de la Cita', {
            'fields': ('cita',)
        }),
        ('Cambios Realizados', {
            'fields': ('estado_anterior', 'estado_nuevo')
        }),
        ('Detalles', {
            'fields': ('observaciones', 'modificado_por', 'fecha_cambio')
        }),
    )
    
    def get_queryset(self, request):
        """Optimiza las consultas"""
        qs = super().get_queryset(request)
        return qs.select_related('cita__paciente', 'cita__profesional__usuario', 'modificado_por')