from rest_framework import serializers
from datetime import date
from .models import Profesional, DisponibilidadProfesional, BloqueoHorario


class ProfesionalSerializer(serializers.ModelSerializer):
    """Serializer completo para Profesional"""
    usuario_nombre = serializers.CharField(source='usuario.get_full_name', read_only=True)
    usuario_email = serializers.EmailField(source='usuario.email', read_only=True)
    
    class Meta:
        model = Profesional
        fields = [
            'id', 'usuario', 'usuario_nombre', 'usuario_email',
            'especialidad', 'titulo_profesional', 'registro_profesional',
            'anos_experiencia', 'duracion_cita_minutos', 'activo_para_citas',
            'biografia', 'foto', 'fecha_creacion', 'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']


class ProfesionalListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados"""
    nombre_completo = serializers.CharField(source='usuario.get_full_name', read_only=True)
    
    class Meta:
        model = Profesional
        fields = ['id', 'nombre_completo', 'especialidad', 'titulo_profesional']


class DisponibilidadProfesionalSerializer(serializers.ModelSerializer):
    """Serializer para disponibilidad de profesionales"""
    profesional_nombre = serializers.CharField(source='profesional.usuario.get_full_name', read_only=True)
    dia_semana_display = serializers.CharField(source='get_dia_semana_display', read_only=True)
    
    class Meta:
        model = DisponibilidadProfesional
        fields = [
            'id', 'profesional', 'profesional_nombre',
            'dia_semana', 'dia_semana_display', 
            'hora_inicio', 'hora_fin', 'activo'
        ]
        read_only_fields = ['id']
    
    def validate(self, data):
        """Valida que hora_fin sea mayor que hora_inicio"""
        if data['hora_fin'] <= data['hora_inicio']:
            raise serializers.ValidationError({
                "hora_fin": "La hora de fin debe ser posterior a la hora de inicio"
            })
        return data


class BloqueoHorarioSerializer(serializers.ModelSerializer):
    """Serializer para bloqueos de horario"""
    profesional_nombre = serializers.CharField(source='profesional.usuario.get_full_name', read_only=True)
    creado_por_nombre = serializers.CharField(source='creado_por.get_full_name', read_only=True)
    motivo_display = serializers.CharField(source='get_motivo_display', read_only=True)
    
    class Meta:
        model = BloqueoHorario
        fields = [
            'id', 'profesional', 'profesional_nombre',
            'fecha_inicio', 'fecha_fin', 'motivo', 'motivo_display',
            'descripcion', 'creado_por', 'creado_por_nombre', 'fecha_creacion'
        ]
        read_only_fields = ['id', 'fecha_creacion']
    
    def validate(self, data):
        """Valida que fecha_fin sea mayor que fecha_inicio"""
        if data['fecha_fin'] <= data['fecha_inicio']:
            raise serializers.ValidationError({
                "fecha_fin": "La fecha de fin debe ser posterior a la fecha de inicio"
            })
        return data


class HorariosDisponiblesSerializer(serializers.Serializer):
    """Serializer para consultar horarios disponibles"""
    fecha = serializers.DateField()
    
    def validate_fecha(self, value):
        """Valida que la fecha no sea en el pasado"""
        if value < date.today():
            raise serializers.ValidationError("No se pueden consultar horarios en fechas pasadas")
        return value