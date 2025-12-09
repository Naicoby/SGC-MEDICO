from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfesionalViewSet,
    DisponibilidadProfesionalViewSet,
    BloqueoHorarioViewSet
)

router = DefaultRouter()
router.register(r'profesionales', ProfesionalViewSet, basename='profesional')
router.register(r'disponibilidades', DisponibilidadProfesionalViewSet, basename='disponibilidad')
router.register(r'bloqueos', BloqueoHorarioViewSet, basename='bloqueo')

urlpatterns = [
    path('', include(router.urls)),
]