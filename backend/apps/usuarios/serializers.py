from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario, HistorialBloqueo


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario"""
    
    nombre_completo = serializers.SerializerMethodField()
    puede_agendar = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'rut', 'email', 'nombre', 'apellido', 'nombre_completo',
            'telefono', 'fecha_nacimiento', 'direccion', 'rol',
            'contador_inasistencias', 'bloqueado', 'fecha_bloqueo',
            'motivo_bloqueo', 'is_active', 'date_joined', 'puede_agendar'
        ]
        read_only_fields = ['id', 'contador_inasistencias', 'bloqueado', 
                           'fecha_bloqueo', 'date_joined']
    
    def get_nombre_completo(self, obj):
        return obj.get_full_name()
    
    def get_puede_agendar(self, obj):
        return obj.puede_agendar()


class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear usuarios (registro)"""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Usuario
        fields = [
            'rut', 'email', 'nombre', 'apellido', 'telefono',
            'fecha_nacimiento', 'direccion', 'password', 'password_confirm'
        ]
    
    def validate(self, data):
        """Validar que las contraseñas coincidan"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden'
            })
        return data
    
    def validate_rut(self, value):
        """Validar formato de RUT"""
        # Aquí puedes agregar validación de RUT chileno si lo deseas
        if Usuario.objects.filter(rut=value).exists():
            raise serializers.ValidationError('Este RUT ya está registrado')
        return value
    
    def create(self, validated_data):
        """Crear usuario con contraseña encriptada"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        usuario = Usuario.objects.create_user(
            password=password,
            rol='PACIENTE',  # Por defecto es paciente
            **validated_data
        )
        return usuario


class UsuarioUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualizar perfil de usuario"""
    
    class Meta:
        model = Usuario
        fields = [
            'nombre', 'apellido', 'telefono', 'fecha_nacimiento', 'direccion'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambiar contraseña"""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden'
            })
        return data


class LoginSerializer(serializers.Serializer):
    """Serializer para login"""
    
    rut = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        """Validar credenciales"""
        rut = data.get('rut')
        password = data.get('password')
        
        if rut and password:
            user = authenticate(request=self.context.get('request'),
                              username=rut, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    'RUT o contraseña incorrectos',
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'Usuario inactivo',
                    code='authorization'
                )
            
            if user.bloqueado:
                raise serializers.ValidationError(
                    f'Usuario bloqueado. Motivo: {user.motivo_bloqueo}',
                    code='authorization'
                )
        else:
            raise serializers.ValidationError(
                'Debe incluir RUT y contraseña',
                code='authorization'
            )
        
        data['user'] = user
        return data


class HistorialBloqueoSerializer(serializers.ModelSerializer):
    """Serializer para el historial de bloqueos"""
    
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)
    desbloqueado_por_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = HistorialBloqueo
        fields = [
            'id', 'usuario', 'usuario_nombre', 'fecha_bloqueo',
            'fecha_desbloqueo', 'motivo', 'inasistencias_acumuladas',
            'desbloqueado_por', 'desbloqueado_por_nombre'
        ]
        read_only_fields = ['fecha_bloqueo']
    
    def get_desbloqueado_por_nombre(self, obj):
        return obj.desbloqueado_por.get_full_name() if obj.desbloqueado_por else None


class DesbloquearUsuarioSerializer(serializers.Serializer):
    """Serializer para desbloquear un usuario"""
    
    motivo = serializers.CharField(required=False, default="Desbloqueado por administrador")