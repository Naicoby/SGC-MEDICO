from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, HistorialBloqueo

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """Administración personalizada del modelo Usuario"""
    
    list_display = ('rut', 'email', 'get_full_name', 'rol', 'bloqueado', 'contador_inasistencias', 'is_active')
    list_filter = ('rol', 'bloqueado', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('rut', 'email', 'nombre', 'apellido')
    ordering = ('-date_joined',)
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('rut', 'email', 'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 'direccion')
        }),
        ('Rol y Permisos', {
            'fields': ('rol', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Control de Inasistencias', {
            'fields': ('contador_inasistencias', 'bloqueado', 'fecha_bloqueo', 'motivo_bloqueo')
        }),
        ('Fechas Importantes', {
            'fields': ('date_joined', 'last_login')
        }),
    )
    
    add_fieldsets = (
        ('Información Básica', {
            'classes': ('wide',),
            'fields': ('rut', 'email', 'nombre', 'apellido', 'password1', 'password2'),
        }),
        ('Información Adicional', {
            'fields': ('telefono', 'fecha_nacimiento', 'direccion', 'rol')
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login')
    
    actions = ['desbloquear_usuarios', 'bloquear_usuarios']
    
    def desbloquear_usuarios(self, request, queryset):
        """Acción para desbloquear usuarios seleccionados"""
        count = 0
        for usuario in queryset:
            if usuario.bloqueado:
                usuario.desbloquear_usuario(motivo="Desbloqueado por administrador")
                count += 1
        self.message_user(request, f'{count} usuario(s) desbloqueado(s) exitosamente.')
    desbloquear_usuarios.short_description = "Desbloquear usuarios seleccionados"
    
    def bloquear_usuarios(self, request, queryset):
        """Acción para bloquear usuarios seleccionados"""
        count = queryset.filter(bloqueado=False).update(bloqueado=True)
        self.message_user(request, f'{count} usuario(s) bloqueado(s) exitosamente.')
    bloquear_usuarios.short_description = "Bloquear usuarios seleccionados"


@admin.register(HistorialBloqueo)
class HistorialBloqueoAdmin(admin.ModelAdmin):
    """Administración del historial de bloqueos"""
    
    list_display = ('usuario', 'fecha_bloqueo', 'fecha_desbloqueo', 'inasistencias_acumuladas', 'desbloqueado_por')
    list_filter = ('fecha_bloqueo', 'fecha_desbloqueo')
    search_fields = ('usuario__rut', 'usuario__nombre', 'usuario__apellido', 'motivo')
    readonly_fields = ('fecha_bloqueo',)
    
    fieldsets = (
        ('Información del Bloqueo', {
            'fields': ('usuario', 'fecha_bloqueo', 'fecha_desbloqueo', 'inasistencias_acumuladas')
        }),
        ('Detalles', {
            'fields': ('motivo', 'desbloqueado_por')
        }),
    )