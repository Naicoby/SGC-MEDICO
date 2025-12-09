from django.contrib import admin

# Asumiendo que tienes modelos de Reportes en apps/reportes/models.py
# Si no los tienes, primero necesitas crearlos

# Ejemplo básico de admin para reportes:
# Descomenta y adapta cuando tengas los modelos

"""
from .models import Reporte, ReporteAgendamiento, ReporteInasistencias

@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    '''Administración de reportes generales'''
    
    list_display = ('id', 'titulo', 'tipo', 'generado_por', 'fecha_generacion')
    list_filter = ('tipo', 'fecha_generacion')
    search_fields = ('titulo', 'descripcion', 'generado_por__nombre')
    date_hierarchy = 'fecha_generacion'
    readonly_fields = ('fecha_generacion',)
    
    fieldsets = (
        ('Información del Reporte', {
            'fields': ('titulo', 'tipo', 'descripcion')
        }),
        ('Período', {
            'fields': ('fecha_inicio', 'fecha_fin')
        }),
        ('Generado Por', {
            'fields': ('generado_por', 'fecha_generacion')
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('generado_por')


@admin.register(ReporteAgendamiento)
class ReporteAgendamientoAdmin(admin.ModelAdmin):
    '''Administración de reportes de agendamiento'''
    
    list_display = ('periodo', 'total_citas', 'citas_completadas', 'citas_canceladas', 
                    'porcentaje_cumplimiento', 'fecha_generacion')
    list_filter = ('fecha_generacion',)
    date_hierarchy = 'fecha_generacion'
    readonly_fields = ('fecha_generacion', 'porcentaje_cumplimiento')
    
    def porcentaje_cumplimiento(self, obj):
        if obj.total_citas > 0:
            return f"{(obj.citas_completadas / obj.total_citas * 100):.2f}%"
        return "0%"
    porcentaje_cumplimiento.short_description = '% Cumplimiento'


@admin.register(ReporteInasistencias)
class ReporteInasistenciasAdmin(admin.ModelAdmin):
    '''Administración de reportes de inasistencias'''
    
    list_display = ('paciente', 'total_inasistencias', 'periodo_inicio', 'periodo_fin', 'bloqueado')
    list_filter = ('bloqueado', 'periodo_inicio')
    search_fields = ('paciente__rut', 'paciente__nombre', 'paciente__apellido')
    date_hierarchy = 'periodo_inicio'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('paciente')
"""

# Register your models here.
# Por ahora deja este comentario hasta que crees los modelos de Reportes