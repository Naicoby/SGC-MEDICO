from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from django.utils import timezone
from .models import Usuario, HistorialBloqueo
from .serializers import (
    UsuarioSerializer, UsuarioCreateSerializer, UsuarioUpdateSerializer,
    ChangePasswordSerializer, LoginSerializer, HistorialBloqueoSerializer,
    DesbloquearUsuarioSerializer
)


class UsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de usuarios"""
    
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def get_serializer_class(self):
        """Retorna el serializer según la acción"""
        if self.action == 'create':
            return UsuarioCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UsuarioUpdateSerializer
        return UsuarioSerializer
    
    def get_permissions(self):
        """Define permisos según la acción"""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Obtiene el perfil del usuario actual"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], permission_classes=[permissions.IsAuthenticated])
    def update_profile(self, request):
        """Actualiza el perfil del usuario actual"""
        serializer = UsuarioUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        """Cambia la contraseña del usuario actual"""
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': 'Contraseña actual incorrecta'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response(
            {'detail': 'Contraseña actualizada exitosamente'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def desbloquear(self, request, pk=None):
        """Desbloquea a un usuario (solo admin)"""
        usuario = self.get_object()
        serializer = DesbloquearUsuarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if not usuario.bloqueado:
            return Response(
                {'detail': 'El usuario no está bloqueado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        historial = HistorialBloqueo.objects.filter(
            usuario=usuario,
            fecha_desbloqueo__isnull=True
        ).first()
        
        if historial:
            historial.fecha_desbloqueo = timezone.now()
            historial.desbloqueado_por = request.user
            historial.save()
        
        usuario.desbloquear_usuario(
            motivo=serializer.validated_data.get('motivo')
        )
        
        return Response(
            {'detail': 'Usuario desbloqueado exitosamente'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def historial_bloqueos(self, request, pk=None):
        """Obtiene el historial de bloqueos de un usuario"""
        usuario = self.get_object()
        
        if request.user.id != usuario.id and not request.user.is_staff:
            return Response(
                {'detail': 'No tiene permiso para ver este historial'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        bloqueos = HistorialBloqueo.objects.filter(usuario=usuario)
        serializer = HistorialBloqueoSerializer(bloqueos, many=True)
        return Response(serializer.data)


class AuthViewSet(viewsets.ViewSet):
    """ViewSet para autenticación"""
    
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login de usuario"""
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UsuarioSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Registro de nuevo usuario"""
        serializer = UsuarioCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UsuarioSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        """Logout de usuario"""
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            logout(request)
            return Response(
                {'detail': 'Logout exitoso'},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {'detail': 'Error al cerrar sesión'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'])
    def refresh(self, request):
        """Refrescar token de acceso"""
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'detail': 'Refresh token requerido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            refresh = RefreshToken(refresh_token)
            return Response({
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                {'detail': 'Token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )


class HistorialBloqueoViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para ver historial de bloqueos (solo lectura)"""
    
    queryset = HistorialBloqueo.objects.all()
    serializer_class = HistorialBloqueoSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        """Filtrar por usuario si se especifica"""
        queryset = super().get_queryset()
        usuario_id = self.request.query_params.get('usuario', None)
        
        if usuario_id:
            queryset = queryset.filter(usuario_id=usuario_id)
        
        return queryset.select_related('usuario', 'desbloqueado_por')