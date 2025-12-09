from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, AuthViewSet, HistorialBloqueoViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'historial-bloqueos', HistorialBloqueoViewSet, basename='historial-bloqueo')

urlpatterns = [
    path('', include(router.urls)),
]