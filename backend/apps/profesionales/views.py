from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Profesional, DisponibilidadProfesional, BloqueoHorario
from .serializers import (
    ProfesionalSerializer, ProfesionalListSerializer,
    DisponibilidadProfesionalSerializer, BloqueoHorarioSerializer,
    HorariosDisponiblesSerializer
)


class ProfesionalViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para profesionales (solo lectura para pacientes)"""
    
    queryset = Profesional.objects.filter(activo_para_citas=True)
    serializer_class = ProfesionalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Retorna serializer según la acción"""
        if self.action == 'list':
            return ProfesionalListSerializer
        return ProfesionalSerializer
    
    def get_queryset(self):
        """Optimizar consultas y filtrar por especialidad si se especifica"""
        queryset = super().get_queryset().select_related('usuario')
        
        especialidad = self.request.query_params.get('especialidad', None)
        if especialidad:
            queryset = queryset.filter(especialidad__icontains=especialidad)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """Obtiene la disponibilidad semanal de un profesional"""
        profesional = self.get_object()
        disponibilidades = DisponibilidadProfesional.objects.filter(
            profesional=profesional,
            activo=True
        ).order_by('dia_semana', 'hora_inicio')
        
        serializer = DisponibilidadProfesionalSerializer(disponibilidades, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def horarios_disponibles(self, request, pk=None):
        """Obtiene horarios disponibles para una fecha específica"""
        profesional = self.get_object()
        serializer = HorariosDisponiblesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        fecha = serializer.validated_data['fecha']
        dia_semana = fecha.weekday()
        
        # Obtener disponibilidad para ese día
        disponibilidad = DisponibilidadProfesional.objects.filter(
            profesional=profesional,
            dia_semana=dia_semana,
            activo=True
        ).first()
        
        if not disponibilidad:
            return Response({
                'horarios': [],
                'mensaje': 'Profesional no tiene disponibilidad este día'
            })
        
        # Generar horarios disponibles
        horarios = self._generar_horarios(
            profesional, 
            fecha, 
            disponibilidad.hora_inicio,
            disponibilidad.hora_fin
        )
        
        return Response({'horarios': horarios})
    
    def _generar_horarios(self, profesional, fecha, hora_inicio, hora_fin):
        """Genera lista de horarios disponibles"""
        from apps.citas.models import Cita
        
        horarios = []
        duracion = profesional.duracion_cita_minutos
        
        # Convertir a datetime
        current_time = datetime.combine(fecha, hora_inicio)
        end_time = datetime.combine(fecha, hora_fin)
        
        while current_time < end_time:
            # Verificar si hay cita en este horario
            cita_existe = Cita.objects.filter(
                profesional=profesional,
                fecha_hora=current_time,
                estado__in=['AGENDADA', 'CONFIRMADA']
            ).exists()
            
            # Verificar si hay bloqueo en este horario
            bloqueo_existe = BloqueoHorario.objects.filter(
                profesional=profesional,
                fecha_inicio__lte=current_time,
                fecha_fin__gt=current_time
            ).exists()
            
            if not cita_existe and not bloqueo_existe:
                horarios.append({
                    'hora': current_time.strftime('%H:%M'),
                    'disponible': True
                })
            
            current_time += timedelta(minutes=duracion)
        
        return horarios


class DisponibilidadProfesionalViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de disponibilidad"""
    
    queryset = DisponibilidadProfesional.objects.all()
    serializer_class = DisponibilidadProfesionalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar por profesional si se especifica"""
        queryset = super().get_queryset().select_related('profesional__usuario')
        
        # Si es profesional, solo ver su propia disponibilidad
        if hasattr(self.request.user, 'perfil_profesional'):
            queryset = queryset.filter(
                profesional=self.request.user.perfil_profesional
            )
        
        profesional_id = self.request.query_params.get('profesional', None)
        if profesional_id:
            queryset = queryset.filter(profesional_id=profesional_id)
        
        return queryset
    
    def perform_create(self, serializer):
        """Solo profesionales y admins pueden crear"""
        if not self.request.user.is_staff and not hasattr(self.request.user, 'perfil_profesional'):
            raise permissions.PermissionDenied('No tiene permiso para crear disponibilidad')
        serializer.save()


class BloqueoHorarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de bloqueos de horario"""
    
    queryset = BloqueoHorario.objects.all()
    serializer_class = BloqueoHorarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar por profesional y fecha"""
        queryset = super().get_queryset().select_related(
            'profesional__usuario', 'creado_por'
        )
        
        # Si es profesional, solo ver sus propios bloqueos
        if hasattr(self.request.user, 'perfil_profesional'):
            queryset = queryset.filter(
                profesional=self.request.user.perfil_profesional
            )
        
        profesional_id = self.request.query_params.get('profesional', None)
        if profesional_id:
            queryset = queryset.filter(profesional_id=profesional_id)
        
        fecha_desde = self.request.query_params.get('fecha_desde', None)
        if fecha_desde:
            queryset = queryset.filter(fecha_inicio__gte=fecha_desde)
        
        fecha_hasta = self.request.query_params.get('fecha_hasta', None)
        if fecha_hasta:
            queryset = queryset.filter(fecha_fin__lte=fecha_hasta)
        
        return queryset
    
    def perform_create(self, serializer):
        """Registrar quién creó el bloqueo"""
        serializer.save(creado_por=self.request.user)