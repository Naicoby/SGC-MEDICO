from django.contrib import admin
from django.utils.html import format_html

# Asumiendo que tienes un modelo Notificacion en apps/notificaciones/models.py
# Si no lo tienes, primero necesitas crearlo

# Ejemplo básico de admin para notificaciones:
# Descomenta y adapta cuando tengas el modelo Notificacion

"""
from .models import Notificacion

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    '''Administración del modelo Notificación'''
    
    list_display = ('id', 'usuario', 'tipo', 'titulo', 'leida_badge', 'created_at')
    list_filter = ('tipo', 'leida', 'created_at')
    search_fields = ('usuario__rut', 'usuario__nombre', 'usuario__apellido', 'titulo', 'mensaje')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Destinatario', {
            'fields': ('usuario',)
        }),
        ('Contenido', {
            'fields': ('tipo', 'titulo', 'mensaje')
        }),
        ('Estado', {
            'fields': ('leida', 'fecha_lectura', 'created_at')
        }),
    )
    
    actions = ['marcar_como_leida', 'marcar_como_no_leida']
    
    def leida_badge(self, obj):
        '''Muestra el estado de lectura con color'''
        if obj.leida:
            return format_html(
                '<span style="background-color: green; color: white; padding: 3px 10px; border-radius: 3px;">Leída</span>'
            )
        return format_html(
            '<span style="background-color: orange; color: white; padding: 3px 10px; border-radius: 3px;">No leída</span>'
        )
    leida_badge.short_description = 'Estado'
    
    def marcar_como_leida(self, request, queryset):
        '''Marca las notificaciones como leídas'''
        from django.utils import timezone
        count = queryset.filter(leida=False).update(leida=True, fecha_lectura=timezone.now())
        self.message_user(request, f'{count} notificación(es) marcada(s) como leída(s).')
    marcar_como_leida.short_description = "Marcar como leída"
    
    def marcar_como_no_leida(self, request, queryset):
        '''Marca las notificaciones como no leídas'''
        count = queryset.filter(leida=True).update(leida=False, fecha_lectura=None)
        self.message_user(request, f'{count} notificación(es) marcada(s) como no leída(s).')
    marcar_como_no_leida.short_description = "Marcar como no leída"
    
    def get_queryset(self, request):
        '''Optimiza las consultas'''
        qs = super().get_queryset(request)
        return qs.select_related('usuario')
"""

# Register your models here.
# Por ahora deja este comentario hasta que crees el modelo Notificacion