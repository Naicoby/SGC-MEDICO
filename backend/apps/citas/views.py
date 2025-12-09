from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q, Count
from .models import Cita, HistorialCita
from .serializers import (
    CitaSerializer, CitaCreateSerializer, CitaListSerializer,
    CancelarCitaSerializer, ConfirmarCitaSerializer, HistorialCitaSerializer,
    EstadisticasCitasSerializer
)


class CitaViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de citas médicas"""
    
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Retorna el serializer según la acción"""
        if self.action == 'create':
            return CitaCreateSerializer
        elif self.action == 'list':
            return CitaListSerializer
        return CitaSerializer
    
    def get_queryset(self):
        """Filtra las citas según el usuario y parámetros"""
        queryset = super().get_queryset().select_related(
            'paciente', 'profesional__usuario'
        )
        
        # Si es paciente, solo ver sus propias citas
        if not self.request.user.is_staff and not hasattr(self.request.user, 'perfil_profesional'):
            queryset = queryset.filter(paciente=self.request.user)
        
        # Si es profesional, solo ver sus propias citas
        if hasattr(self.request.user, 'perfil_profesional'):
            queryset = queryset.filter(profesional=self.request.user.perfil_profesional)
        
        # Filtros adicionales
        fecha = self.request.query_params.get('fecha', None)
        if fecha:
            queryset = queryset.filter(fecha_hora__date=fecha)
        
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset.order_by('-fecha_hora')
    
    def perform_create(self, serializer):
        """Asigna automáticamente el paciente al crear la cita"""
        serializer.save()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mis_proximas_citas(self, request):
        """Obtiene las próximas citas del usuario actual"""
        ahora = timezone.now()
        
        if hasattr(request.user, 'perfil_profesional'):
            # Si es profesional, obtiene sus próximas citas
            citas = Cita.objects.filter(
                profesional=request.user.perfil_profesional,
                fecha_hora__gte=ahora,
                estado__in=['AGENDADA', 'CONFIRMADA']
            ).order_by('fecha_hora')[:10]
        else:
            # Si es paciente, obtiene sus próximas citas
            citas = Cita.objects.filter(
                paciente=request.user,
                fecha_hora__gte=ahora,
                estado__in=['AGENDADA', 'CONFIRMADA']
            ).order_by('fecha_hora')[:10]
        
        serializer = CitaListSerializer(citas, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancelar(self, request, pk=None):
        """Cancela una cita si cumple con las condiciones"""
        cita = self.get_object()
        
        # Validar que sea el paciente quien cancela
        if request.user != cita.paciente and not request.user.is_staff:
            return Response(
                {'detail': 'No tiene permiso para cancelar esta cita'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CancelarCitaSerializer(
            data=request.data,
            context={'cita': cita}
        )
        serializer.is_valid(raise_exception=True)
        
        # Cancelar la cita
        cita.estado = 'CANCELADA'
        cita.fecha_cancelacion = timezone.now()
        cita.motivo_cancelacion = serializer.validated_data['motivo_cancelacion']
        cita.cancelada_por = request.user
        cita.save()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior='AGENDADA',
            estado_nuevo='CANCELADA',
            modificado_por=request.user,
            observaciones=f"Cancelada por: {request.user.get_full_name()}"
        )
        
        return Response(
            {'detail': 'Cita cancelada exitosamente'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def confirmar(self, request, pk=None):
        """Confirma la asistencia a una cita"""
        cita = self.get_object()
        
        # Validar que sea el paciente quien confirma
        if request.user != cita.paciente:
            return Response(
                {'detail': 'Solo el paciente puede confirmar la cita'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if cita.estado != 'AGENDADA':
            return Response(
                {'detail': 'Solo se pueden confirmar citas en estado AGENDADA'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Confirmar la cita
        cita.confirmada_por_paciente = True
        cita.fecha_confirmacion = timezone.now()
        cita.estado = 'CONFIRMADA'
        cita.save()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior='AGENDADA',
            estado_nuevo='CONFIRMADA',
            modificado_por=request.user,
            observaciones="Confirmada por el paciente"
        )
        
        return Response(
            {'detail': 'Cita confirmada exitosamente'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def completar(self, request, pk=None):
        """Marca una cita como completada (solo profesionales)"""
        cita = self.get_object()
        
        if not hasattr(request.user, 'perfil_profesional'):
            return Response(
                {'detail': 'Solo profesionales pueden completar citas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if cita.profesional != request.user.perfil_profesional:
            return Response(
                {'detail': 'Solo puede completar sus propias citas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if cita.estado != 'CONFIRMADA' and cita.estado != 'AGENDADA':
            return Response(
                {'detail': 'Solo se pueden completar citas agendadas o confirmadas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cita.estado = 'COMPLETADA'
        cita.notas_profesional = request.data.get('notas_profesional', '')
        cita.save()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior=cita.estado,
            estado_nuevo='COMPLETADA',
            modificado_por=request.user,
            observaciones="Cita completada por el profesional"
        )
        
        return Response({'detail': 'Cita completada exitosamente'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def marcar_no_asistio(self, request, pk=None):
        """Marca una cita como 'No Asistió' y penaliza al paciente"""
        cita = self.get_object()
        
        if not hasattr(request.user, 'perfil_profesional') and not request.user.is_staff:
            return Response(
                {'detail': 'No tiene permiso para esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if cita.estado == 'NO_ASISTIO':
            return Response(
                {'detail': 'Esta cita ya está marcada como No Asistió'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cita.marcar_no_asistio()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior=cita.estado,
            estado_nuevo='NO_ASISTIO',
            modificado_por=request.user,
            observaciones="Paciente no asistió a la cita"
        )
        
        return Response({
            'detail': 'Marcado como No Asistió. Inasistencia registrada.',
            'inasistencias_paciente': cita.paciente.contador_inasistencias,
            'paciente_bloqueado': cita.paciente.bloqueado
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def estadisticas(self, request):
        """Obtiene estadísticas de citas (solo admin)"""
        fecha_desde = request.query_params.get('fecha_desde', None)
        fecha_hasta = request.query_params.get('fecha_hasta', None)
        
        queryset = Cita.objects.all()
        
        if fecha_desde:
            queryset = queryset.filter(fecha_hora__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_hora__lte=fecha_hasta)
        
        # Calcular estadísticas
        total_citas = queryset.count()
        estadisticas_por_estado = queryset.values('estado').annotate(
            total=Count('id')
        )
        
        citas_agendadas = queryset.filter(estado='AGENDADA').count()
        citas_confirmadas = queryset.filter(estado='CONFIRMADA').count()
        citas_completadas = queryset.filter(estado='COMPLETADA').count()
        citas_canceladas = queryset.filter(estado='CANCELADA').count()
        citas_no_asistio = queryset.filter(estado='NO_ASISTIO').count()
        
        # Calcular tasa de inasistencia
        citas_realizadas = citas_completadas + citas_no_asistio
        tasa_inasistencia = (citas_no_asistio / citas_realizadas * 100) if citas_realizadas > 0 else 0
        
        data = {
            'total_citas': total_citas,
            'citas_agendadas': citas_agendadas,
            'citas_confirmadas': citas_confirmadas,
            'citas_completadas': citas_completadas,
            'citas_canceladas': citas_canceladas,
            'citas_no_asistio': citas_no_asistio,
            'tasa_inasistencia': round(tasa_inasistencia, 2),
            'estadisticas_por_estado': estadisticas_por_estado,
        }
        
        serializer = EstadisticasCitasSerializer(data)
        return Response(serializer.data)


class HistorialCitaViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para ver el historial de cambios de citas"""
    
    queryset = HistorialCita.objects.all()
    serializer_class = HistorialCitaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtra el historial según el usuario"""
        queryset = super().get_queryset().select_related(
            'cita', 'modificado_por'
        )
        
        # Si es paciente, solo ver historial de sus citas
        if not self.request.user.is_staff and not hasattr(self.request.user, 'perfil_profesional'):
            queryset = queryset.filter(cita__paciente=self.request.user)
        
        # Si es profesional, solo ver historial de sus citas
        if hasattr(self.request.user, 'perfil_profesional'):
            queryset = queryset.filter(cita__profesional=self.request.user.perfil_profesional)
        
        # Filtrar por cita específica si se proporciona
        cita_id = self.request.query_params.get('cita', None)
        if cita_id:
            queryset = queryset.filter(cita_id=cita_id)
        
        return queryset.order_by('-fecha_cambio')