from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, HistorialCitaViewSet

router = DefaultRouter()
router.register(r'citas', CitaViewSet, basename='cita')
router.register(r'historial-citas', HistorialCitaViewSet, basename='historial-cita')

urlpatterns = [
    path('', include(router.urls)),
]