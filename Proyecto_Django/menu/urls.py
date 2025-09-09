from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls 
from .views import *
router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioView, 'usuario')
router.register(r'mascota', MascotaView, 'mascota')
router.register(r'rol', RolView, 'rol')
router.register(r'paseo', PaseoView, 'paseo')
urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title='Usuario API')),
]