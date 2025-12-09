"""
URL configuration for SGC project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include('apps.usuarios.urls')),
    path('api/v1/', include('apps.profesionales.urls')),
    path('api/v1/', include('apps.citas.urls')),
    
    # JWT Token Refresh (alternativa)
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Personalizar admin
admin.site.site_header = "SGC - Sistema de Gestión de Citas"
admin.site.site_title = "SGC Admin"
admin.site.index_title = "Panel de Administración"