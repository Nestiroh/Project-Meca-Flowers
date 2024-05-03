from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),

    path('', views.menu_inicio, name='menu_inicio'),

    path('productos/', views.productos, name='productos'),

    path('instalaciones/', views.instalaciones, name='instala'),

    path('contactenos/', views.contactenos, name='contactenos'),

    path('clasificacion/', views.clasifica, name='clasifica'),

    path('adminis/', views.adminis, name='adminis'),
    
]