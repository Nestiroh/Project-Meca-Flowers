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
    
    path('agregar_usuario/', views.agregar_usuario, name='agregar_usuario'),

    path('eliminar_usuario/', views.eliminar_usuario, name='eliminar_usuario'),
    
    path('cargar_usuarios/', views.cargar_usuarios, name='cargar_usuarios'),

    path('obtener_usuario/<int:usuario_id>/', views.obtener_usuario, name='obtener_usuario'),
    
    path('guardar_usuario/', views.guardar_usuario, name='guardar_usuario'),

    path('get_stock/', views.get_stock, name='get_stock'),

    path('update_stock/', views.update_stock, name='update_stock'),

    path('create-order/', views.create_order, name='create_order'),

    path('Roles/', views.Roles, name='Roles'),

    path('add_pedido_parte/', views.add_pedido_parte, name='add_pedido_parte'),

    path('get_pedido_parte/', views.get_pedido_parte, name='get_pedido_parte'),

    path('delete_pedido_parte/', views.delete_pedido_parte, name='delete_pedido_parte'),

    path('get_conductores/', views.get_conductores, name='get_conductores'),

    path('get_entidades/', views.get_entidades, name='get_entidades'),

    path('delete-order/', views.delete_order, name='delete_order'),
]