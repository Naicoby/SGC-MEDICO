from rest_framework import serializers
from django.utils import timezone
from .models import Cita, HistorialCita
from apps.profesionales.serializers import ProfesionalListSerializer
from apps.usuarios.serializers import UsuarioSerializer


class CitaSerializer(serializers.ModelSerializer):
    """Serializer completo para el modelo Cita"""
    
    paciente_nombre = serializers.CharField(source='paciente.get_full_name', read_only=True)
    profesional_nombre = serializers.SerializerMethodField()
    profesional_detalle = ProfesionalListSerializer(source='profesional', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    puede_cancelar = serializers.SerializerMethodField()
    hora_fin = serializers.SerializerMethodField()
    
    class Meta:
        model = Cita
        fields = [
            'id', 'paciente', 'paciente_nombre', 'profesional', 
            'profesional_nombre', 'profesional_detalle', 'fecha_hora',
            'hora_fin', 'duracion_minutos', 'motivo_consulta', 'estado',
            'estado_display', 'confirmada_por_paciente', 'fecha_confirmacion',
            'recordatorio_enviado', 'fecha_recordatorio', 'fecha_cancelacion',
            'motivo_cancelacion', 'cancelada_por', 'observaciones',
            'notas_profesional', 'puede_cancelar', 'fecha_creacion'
        ]
        read_only_fields = [
            'fecha_confirmacion', 'fecha_recordatorio', 'fecha_cancelacion',
            'fecha_creacion'
        ]
    
    def get_profesional_nombre(self, obj):
        return f"Dr(a). {obj.profesional.usuario.get_full_name()}"
    
    def get_puede_cancelar(self, obj):
        return obj.puede_cancelar()
    
    def get_hora_fin(self, obj):
        return obj.get_hora_fin()


class CitaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear una nueva cita"""
    
    class Meta:
        model = Cita
        fields = [
            'profesional', 'fecha_hora', 'duracion_minutos', 'motivo_consulta'
        ]
    
    def validate_fecha_hora(self, value):
        """Validar que la fecha sea futura"""
        if value <= timezone.now():
            raise serializers.ValidationError('La fecha debe ser futura')
        return value
    
    def validate(self, data):
        """Validar disponibilidad del profesional"""
        profesional = data.get('profesional')
        fecha_hora = data.get('fecha_hora')
        
        # Verificar que el profesional esté activo
        if not profesional.activo_para_citas:
            raise serializers.ValidationError({
                'profesional': 'Este profesional no está activo para citas'
            })
        
        # Verificar que no haya otra cita en el mismo horario
        citas_existentes = Cita.objects.filter(
            profesional=profesional,
            fecha_hora=fecha_hora,
            estado__in=['AGENDADA', 'CONFIRMADA']
        )
        
        if citas_existentes.exists():
            raise serializers.ValidationError({
                'fecha_hora': 'Este horario ya está ocupado'
            })
        
        return data
    
    def create(self, validated_data):
        """Crear cita asignando al paciente actual"""
        request = self.context.get('request')
        validated_data['paciente'] = request.user
        
        # Verificar que el paciente pueda agendar
        if not request.user.puede_agendar():
            raise serializers.ValidationError(
                'No puede agendar citas. Usuario bloqueado.'
            )
        
        return super().create(validated_data)


class CitaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listado de citas"""
    
    paciente_nombre = serializers.CharField(source='paciente.get_full_name', read_only=True)
    profesional_nombre = serializers.SerializerMethodField()
    especialidad = serializers.CharField(source='profesional.especialidad', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    
    class Meta:
        model = Cita
        fields = [
            'id', 'paciente_nombre', 'profesional_nombre', 'especialidad',
            'fecha_hora', 'duracion_minutos', 'estado', 'estado_display',
            'confirmada_por_paciente'
        ]
    
    def get_profesional_nombre(self, obj):
        return f"Dr(a). {obj.profesional.usuario.get_full_name()}"


class CancelarCitaSerializer(serializers.Serializer):
    """Serializer para cancelar una cita"""
    
    motivo_cancelacion = serializers.CharField(required=True, max_length=500)
    
    def validate(self, data):
        """Validar que se pueda cancelar la cita"""
        cita = self.context.get('cita')
        
        if not cita.puede_cancelar():
            raise serializers.ValidationError(
                'No se puede cancelar esta cita. Debe hacerlo con al menos 24 horas de anticipación.'
            )
        
        return data


class ConfirmarCitaSerializer(serializers.Serializer):
    """Serializer para confirmar asistencia a una cita"""
    
    confirmar = serializers.BooleanField(default=True)


class HistorialCitaSerializer(serializers.ModelSerializer):
    """Serializer para el historial de cambios de cita"""
    
    modificado_por_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = HistorialCita
        fields = [
            'id', 'cita', 'estado_anterior', 'estado_nuevo',
            'fecha_cambio', 'modificado_por', 'modificado_por_nombre',
            'observaciones'
        ]
        read_only_fields = ['fecha_cambio']
    
    def get_modificado_por_nombre(self, obj):
        return obj.modificado_por.get_full_name() if obj.modificado_por else 'Sistema'


class EstadisticasCitasSerializer(serializers.Serializer):
    """Serializer para estadísticas de citas"""
    
    total_citas = serializers.IntegerField()
    citas_agendadas = serializers.IntegerField()
    citas_confirmadas = serializers.IntegerField()
    citas_completadas = serializers.IntegerField()
    citas_canceladas = serializers.IntegerField()
    citas_no_asistio = serializers.IntegerField()
    tasa_inasistencia = serializers.FloatField()