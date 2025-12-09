from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class UsuarioManager(BaseUserManager):
    """Manager personalizado para el modelo Usuario"""
    
    def create_user(self, rut, email, password=None, **extra_fields):
        """Crea y guarda un Usuario regular"""
        if not rut:
            raise ValueError('El RUT es obligatorio')
        if not email:
            raise ValueError('El email es obligatorio')
        
        email = self.normalize_email(email)
        user = self.model(rut=rut, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, rut, email, password=None, **extra_fields):
        """Crea y guarda un Superusuario"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('rol', 'ADMIN')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')
        
        return self.create_user(rut, email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de Usuario personalizado para el SGC
    Representa a Pacientes, Profesionales y Administradores
    """
    
    ROLES = (
        ('PACIENTE', 'Paciente'),
        ('PROFESIONAL', 'Profesional'),
        ('ADMIN', 'Administrador'),
    )
    
        # Campos principales
    rut = models.CharField(max_length=12, unique=True, verbose_name='RUT')
    email = models.EmailField(unique=True, verbose_name='Correo Electrónico')
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    apellido = models.CharField(max_length=100, verbose_name='Apellido')
    telefono = models.CharField(max_length=15, blank=True, null=True, verbose_name='Teléfono')
    fecha_nacimiento = models.DateField(blank=True, null=True, verbose_name='Fecha de Nacimiento')
    direccion = models.TextField(blank=True, null=True, verbose_name='Dirección')
    
    # Rol y permisos
    rol = models.CharField(max_length=20, choices=ROLES, default='PACIENTE', verbose_name='Rol')
    
    # Control de inasistencias (para pacientes)
    contador_inasistencias = models.IntegerField(default=0, verbose_name='Contador de Inasistencias')
    bloqueado = models.BooleanField(default=False, verbose_name='¿Está Bloqueado?')
    fecha_bloqueo = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Bloqueo')
    motivo_bloqueo = models.TextField(blank=True, verbose_name='Motivo del Bloqueo')
    
    # Campos de Django
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    is_staff = models.BooleanField(default=False, verbose_name='Es Staff')
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='Fecha de Registro')
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'rut'
    REQUIRED_FIELDS = ['email', 'nombre', 'apellido']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} - {self.rut}"
    
    def get_full_name(self):
        """Retorna el nombre completo del usuario"""
        return f"{self.nombre} {self.apellido}"
    
    def puede_agendar(self):
        """Verifica si el usuario puede agendar citas"""
        return not self.bloqueado and self.is_active
    
    def incrementar_inasistencias(self):
        """Incrementa el contador de inasistencias"""
        from django.conf import settings
        self.contador_inasistencias += 1
        
        # Bloquear si alcanza el máximo
        if self.contador_inasistencias >= settings.MAX_INASISTENCIAS:
            self.bloqueado = True
            self.fecha_bloqueo = timezone.now()
            self.motivo_bloqueo = f"Bloqueado automáticamente por {self.contador_inasistencias} inasistencias"
        
        self.save()
    
    def desbloquear_usuario(self, motivo="Desbloqueado por administrador"):
        """Desbloquea al usuario y reinicia el contador"""
        self.bloqueado = False
        self.contador_inasistencias = 0
        self.fecha_bloqueo = None
        self.motivo_bloqueo = motivo
        self.save()


class HistorialBloqueo(models.Model):
    """
    Registro histórico de bloqueos de usuarios
    """
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='historial_bloqueos')
    fecha_bloqueo = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Bloqueo')
    fecha_desbloqueo = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de Desbloqueo')
    motivo = models.TextField(verbose_name='Motivo')
    inasistencias_acumuladas = models.IntegerField(verbose_name='Inasistencias Acumuladas')
    desbloqueado_por = models.ForeignKey(
        Usuario, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='bloqueos_gestionados',
        verbose_name='Desbloqueado Por'
    )
    
    class Meta:
        verbose_name = 'Historial de Bloqueo'
        verbose_name_plural = 'Historiales de Bloqueos'
        ordering = ['-fecha_bloqueo']
    
    def __str__(self):
        return f"Bloqueo de {self.usuario.get_full_name()} - {self.fecha_bloqueo.strftime('%d/%m/%Y')}"