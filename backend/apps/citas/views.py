from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q
from .models import Cita, HistorialCita
from .serializers import (
    CitaSerializer, CitaCreateSerializer, CitaListSerializer,
    CancelarCitaSerializer, ConfirmarCitaSerializer,
    HistorialCitaSerializer, EstadisticasCitasSerializer
)


class CitaViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de citas"""
    
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Retorna serializer según la acción"""
        if self.action == 'create':
            return CitaCreateSerializer
        elif self.action == 'list':
            return CitaListSerializer
        return CitaSerializer
    
    def get_queryset(self):
        """Filtrar citas según el rol del usuario"""
        queryset = super().get_queryset().select_related(
            'paciente', 'profesional__usuario', 'cancelada_por'
        )
        
        user = self.request.user
        
        # Si es paciente, solo ver sus propias citas
        if user.rol == 'PACIENTE':
            queryset = queryset.filter(paciente=user)
        
        # Si es profesional, solo ver sus citas asignadas
        elif user.rol == 'PROFESIONAL' and hasattr(user, 'perfil_profesional'):
            queryset = queryset.filter(profesional=user.perfil_profesional)
        
        # Admin ve todas las citas
        
        # Filtros adicionales por query params
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        fecha_desde = self.request.query_params.get('fecha_desde', None)
        if fecha_desde:
            queryset = queryset.filter(fecha_hora__gte=fecha_desde)
        
        fecha_hasta = self.request.query_params.get('fecha_hasta', None)
        if fecha_hasta:
            queryset = queryset.filter(fecha_hora__lte=fecha_hasta)
        
        return queryset.order_by('-fecha_hora')
    
    def perform_create(self, serializer):
        """Crear cita y registrar en historial"""
        cita = serializer.save()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior='',
            estado_nuevo='AGENDADA',
            modificado_por=self.request.user,
            observaciones='Cita creada'
        )
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """Cancelar una cita"""
        cita = self.get_object()
        
        # Verificar permisos
        if request.user.rol == 'PACIENTE' and cita.paciente != request.user:
            return Response(
                {'detail': 'No tiene permiso para cancelar esta cita'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CancelarCitaSerializer(
            data=request.data,
            context={'cita': cita}
        )
        serializer.is_valid(raise_exception=True)
        
        try:
            estado_anterior = cita.estado
            cita.cancelar(
                usuario=request.user,
                motivo=serializer.validated_data['motivo_cancelacion']
            )
            
            # Registrar en historial
            HistorialCita.objects.create(
                cita=cita,
                estado_anterior=estado_anterior,
                estado_nuevo='CANCELADA',
                modificado_por=request.user,
                observaciones=serializer.validated_data['motivo_cancelacion']
            )
            
            return Response(
                {'detail': 'Cita cancelada exitosamente'},
                status=status.HTTP_200_OK
            )
        except ValueError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """Confirmar asistencia a una cita"""
        cita = self.get_object()
        
        # Solo el paciente puede confirmar su cita
        if cita.paciente != request.user:
            return Response(
                {'detail': 'Solo el paciente puede confirmar la cita'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if cita.estado not in ['AGENDADA', 'CONFIRMADA']:
            return Response(
                {'detail': 'Esta cita no puede ser confirmada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        estado_anterior = cita.estado
        cita.confirmar_cita()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior=estado_anterior,
            estado_nuevo='CONFIRMADA',
            modificado_por=request.user,
            observaciones='Cita confirmada por paciente'
        )
        
        return Response(
            {'detail': 'Cita confirmada exitosamente'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def marcar_no_asistio(self, request, pk=None):
        """Marcar cita como no asistida (solo admin)"""
        cita = self.get_object()
        
        if cita.estado not in ['AGENDADA', 'CONFIRMADA']:
            return Response(
                {'detail': 'Esta cita no puede marcarse como no asistida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        estado_anterior = cita.estado
        cita.marcar_no_asistio()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior=estado_anterior,
            estado_nuevo='NO_ASISTIO',
            modificado_por=request.user,
            observaciones='Paciente no asistió a la cita'
        )
        
        mensaje = f'Cita marcada como no asistida. Contador de inasistencias: {cita.paciente.contador_inasistencias}'
        if cita.paciente.bloqueado:
            mensaje += '. Usuario bloqueado automáticamente.'
        
        return Response(
            {'detail': mensaje},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def completar(self, request, pk=None):
        """Marcar cita como completada (profesional o admin)"""
        cita = self.get_object()
        
        # Verificar permisos
        if request.user.rol == 'PROFESIONAL':
            if not hasattr(request.user, 'perfil_profesional') or cita.profesional != request.user.perfil_profesional:
                return Response(
                    {'detail': 'No tiene permiso para completar esta cita'},
                    status=status.HTTP_403_FORBIDDEN
                )
        elif request.user.rol != 'ADMIN':
            return Response(
                {'detail': 'Solo profesionales y administradores pueden completar citas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if cita.estado not in ['AGENDADA', 'CONFIRMADA', 'EN_CURSO']:
            return Response(
                {'detail': 'Esta cita no puede marcarse como completada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        estado_anterior = cita.estado
        cita.estado = 'COMPLETADA'
        
        # Actualizar notas del profesional si se envían
        notas = request.data.get('notas_profesional', None)
        if notas:
            cita.notas_profesional = notas
        
        cita.save()
        
        # Registrar en historial
        HistorialCita.objects.create(
            cita=cita,
            estado_anterior=estado_anterior,
            estado_nuevo='COMPLETADA',
            modificado_por=request.user,
            observaciones='Cita completada'
        )
        
        return Response(
            {'detail': 'Cita completada exitosamente'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def mis_proximas_citas(self, request):
        """Obtiene las próximas citas del usuario"""
        if request.user.rol == 'PACIENTE':
            citas = Cita.objects.filter(
                paciente=request.user,
                fecha_hora__gte=timezone.now(),
                estado__in=['AGENDADA', 'CONFIRMADA']
            ).order_by('fecha_hora')[:5]
        elif request.user.rol == 'PROFESIONAL' and hasattr(request.user, 'perfil_profesional'):
            citas = Cita.objects.filter(
                profesional=request.user.perfil_profesional,
                fecha_hora__gte=timezone.now(),
                estado__in=['AGENDADA', 'CONFIRMADA']
            ).order_by('fecha_hora')[:10]
        else:
            return Response([])
        
        serializer = CitaListSerializer(citas, many=True)
        return Response(serializer.data)
    
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
        
        stats = queryset.aggregate(
            total=Count('id'),
            agendadas=Count('id', filter=Q(estado='AGENDADA')),
            confirmadas=Count('id', filter=Q(estado='CONFIRMADA')),
            completadas=Count('id', filter=Q(estado='COMPLETADA')),
            canceladas=Count('id', filter=Q(estado='CANCELADA')),
            no_asistio=Count('id', filter=Q(estado='NO_ASISTIO'))
        )
        
        # Calcular tasa de inasistencia
        total_citas = stats['total']
        if total_citas > 0:
            tasa_inasistencia = (stats['no_asistio'] / total_citas) * 100
        else:
            tasa_inasistencia = 0
        
        data = {
            'total_citas': stats['total'],
            'citas_agendadas': stats['agendadas'],
            'citas_confirmadas': stats['confirmadas'],
            'citas_completadas': stats['completadas'],
            'citas_canceladas': stats['canceladas'],
            'citas_no_asistio': stats['no_asistio'],
            'tasa_inasistencia': round(tasa_inasistencia, 2)
        }
        
        serializer = EstadisticasCitasSerializer(data=data)
        serializer.is_valid()
        return Response(serializer.data)


class HistorialCitaViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para ver historial de citas (solo lectura)"""
    
    queryset = HistorialCita.objects.all()
    serializer_class = HistorialCitaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar por cita si se especifica"""
        queryset = super().get_queryset().select_related(
            'cita__paciente', 'cita__profesional__usuario', 'modificado_por'
        )
        
        cita_id = self.request.query_params.get('cita', None)
        if cita_id:
            queryset = queryset.filter(cita_id=cita_id)
        
        return queryset.order_by('-fecha_cambio')