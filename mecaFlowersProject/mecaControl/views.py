from django.shortcuts import render, redirect
import hashlib
from .forms import LoginForm
from .models import Usuario, Pedido, Entidad, PedidoParte, Empaque
from .models import Producto
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
from django.utils import timezone
from django.db import transaction
import json

def login_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if 'user_id' not in request.session:
            return redirect(reverse('login'))
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def login(request):
    error_message = None

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            contrasena = form.cleaned_data['contrasena']
          
            contrasena_encriptada = hashlib.sha256(contrasena.encode()).hexdigest()

            try:
                usuario_bd = Usuario.objects.get(email=email)
    
                if contrasena_encriptada == usuario_bd.contrasena:
                    request.session['user_id'] = usuario_bd.id_usuario
                                          
                    return redirect(reverse('adminis') + f'?nombre_usuario={usuario_bd.nombre}&rol_usuario={usuario_bd.rol_usuario}')
                else:
                    error_message = "Usuario o contraseña incorrectos."
            except Usuario.DoesNotExist:
                error_message = "El usuario no existe."
        else:
            error_message = "Por favor, corrija los datos."
    else:
        form = LoginForm()

    return render(request, 'Usuario.html', {'form': form, 'error_message': error_message})

def agregar_usuario(request):
    if request.method == 'POST':
        email = request.POST.get('correo')

      
        if Usuario.objects.filter(email=email).exists():
            return JsonResponse({'message': 'El correo ya está registrado'})

        nombre = request.POST.get('nombre_usuario')
        contrasena = request.POST.get('contraseña')
        rol_usuario = request.POST.get('rol')
        telefono = request.POST.get('telefono')

        usuario = Usuario(nombre=nombre, email=email, contrasena=contrasena, rol_usuario=rol_usuario, telefono=telefono)
        usuario.save()

        return JsonResponse({'message': 'Usuario agregado correctamente'}, status=200)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

def eliminar_usuario(request):
    if request.method == 'POST':
        correo_usuario = request.POST.get('correo_usuario')
        try:
            usuario = Usuario.objects.get(email=correo_usuario)
            usuario.delete()
            mensaje = "Usuario eliminado correctamente."
            return JsonResponse({'message': mensaje})
        except Usuario.DoesNotExist:
            mensaje = "El usuario no existe."
            return JsonResponse({'message': mensaje})
    else:
        mensaje = "Método no permitido."
        return JsonResponse({'message': mensaje})

def menu_inicio(request):
    return render(request, 'PaginaPrincipal.html', {})

def productos(request):
    return render(request, 'Productos.html', {})

def instalaciones(request):
    return render(request, 'Instalaciones.html', {})

def contactenos(request):
    return render(request, 'Contactenos.html', {})

def clasifica(request):
    return render(request, 'Clasificacion_P.html', {})

def adminis(request):
    user_id = request.session.get('user_id')
    if user_id:
        try:
            usuario_bd = Usuario.objects.get(id_usuario=user_id)
            nombre_usuario = usuario_bd.nombre
            rol_usuario = usuario_bd.rol_usuario
            pedidos = Pedido.objects.all()  


            return render(request, 'Admin.html', {'nombre_usuario': nombre_usuario, 'rol_usuario': rol_usuario, 'pedidos': pedidos})
        except Usuario.DoesNotExist:
            messages.error(request, 'Error al recuperar los datos del usuario.')
            return render(request, 'Admin.html', {'error_message': 'Error al recuperar los datos del usuario.'})
    else:
        messages.error(request, 'No se ha iniciado sesión correctamente.')
        return render(request, 'Admin.html', {'error_message': 'No se ha iniciado sesión correctamente.'})


def cargar_usuarios(request):
    usuarios = Usuario.objects.all()
    usuarios_data = [{'id_usuario': usuario.id_usuario, 'nombre': usuario.nombre, 'email': usuario.email, 'rol_usuario': usuario.rol_usuario} for usuario in usuarios]
    return JsonResponse({'usuarios': usuarios_data})

def obtener_usuario(request, usuario_id):
    try:
        usuario = Usuario.objects.get(id_usuario=usuario_id)
        usuario_data = {'id_usuario': usuario.id_usuario, 'nombre': usuario.nombre, 'email': usuario.email, 'rol_usuario': usuario.rol_usuario}
        return JsonResponse({'usuario': usuario_data})
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'})

def guardar_usuario(request):
    if request.method == 'POST':
        usuario_id = request.POST.get('id_usuario')
        nuevo_nombre = request.POST.get('nombre')
        nuevo_email = request.POST.get('email')
        nuevo_rol = request.POST.get('rol_usuario')
        try:
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            usuario.nombre = nuevo_nombre
            usuario.email = nuevo_email
            usuario.rol_usuario = nuevo_rol
            usuario.save()
            return JsonResponse({'mensaje': 'Usuario actualizado correctamente'})
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'})
    else:
        return JsonResponse({'error': 'Método no permitido'})

def get_stock(request): #Se obtiene el sotck de producto
    producto_id = request.GET.get('product_id')  
    producto = Producto.objects.get(id_producto=producto_id)
    stock = producto.stock
    data = {'stock': stock}
    return JsonResponse(data)

def update_stock(request):#Se actualiza el stock de los productos
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        new_quantity = request.POST.get('new_quantity')
        
        try:
            producto = Producto.objects.get(id_producto=product_id)
            producto.stock = new_quantity
            producto.save()
            return JsonResponse({'success': True})
        except Producto.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Producto no encontrado'}, status=404)
    else:
        return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

def get_conductores(request):#obtener conductores para pedido
    conductores = Usuario.objects.filter(rol_usuario='Conductor')
    conductores_data = [{'id_usuario': conductor.id_usuario, 'nombre': conductor.nombre} for conductor in conductores]
    return JsonResponse({'conductores': conductores_data})

def get_entidades(request):#obtener entidades para pedido
    entidades = Entidad.objects.all()
    entidades_data = [{'id_entidad': entidad.id_entidad, 'nombre_entidad': entidad.nombre_entidad} for entidad in entidades]
    return JsonResponse({'entidades': entidades_data})

from django.db import IntegrityError

def create_order(request): #Crea el pedido
    if request.method == 'POST':
        estado = request.POST.get('estado')
        conductor_id = request.POST.get('conductor')  # Cambio aquí: Obtener el ID del conductor
        user_id = request.session.get('user_id')
        entidad_option = request.POST.get('entidad-option')

        if user_id:
            try:
                usuario_bd = Usuario.objects.get(id_usuario=user_id)

                if entidad_option == 'existente':
                    id_entidad = request.POST.get('entidad')
                    if not Entidad.objects.filter(id_entidad=id_entidad).exists():
                        return JsonResponse({'success': False, 'error': 'La entidad no existe.'})
                elif entidad_option == 'nueva':
                    nombre_entidad = request.POST.get('nombre_entidad')
                    gmail = request.POST.get('gmail')
                    try:
                        # Crear la nueva entidad
                        entidad = Entidad.objects.create(nombre_entidad=nombre_entidad, gmail=gmail)
                        # Obtener el ID de la última entidad creada
                        id_entidad = Entidad.objects.latest('id_entidad').id_entidad
                    except IntegrityError:
                        return JsonResponse({'success': False, 'error': 'Error al crear la entidad.'})
                else:
                    return JsonResponse({'success': False, 'error': 'Opción de entidad no válida.'})

                # Cambio aquí: Obtener el objeto Usuario del conductor
                conductor = Usuario.objects.get(id_usuario=conductor_id)

                # Crear el pedido utilizando el ID de la entidad y el objeto Usuario del conductor
                pedido = Pedido.objects.create(
                    fecha_pedido=timezone.now(),
                    id_usuario=usuario_bd,
                    total=0,
                    estado=estado,
                    id_entidad_id=id_entidad,
                    conductor=conductor  # Cambio aquí: Asignar el objeto Usuario del conductor
                )
                pedido_data = {
                    'id_pedido': pedido.id_pedido,
                    'fecha_pedido': pedido.fecha_pedido.strftime('%Y-%m-%d'),
                    'nombre_usuario': usuario_bd.nombre,
                    'total': pedido.total,
                    'estado': pedido.estado,
                    'conductor': pedido.conductor.nombre  # Cambio aquí: Obtener el nombre del conductor
                }
                return JsonResponse({'success': True, 'order': pedido_data, 'mensaje': 'Pedido actualizado correctamente'})
            except Usuario.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Error al recuperar los datos del usuario.'})
        else:
            return JsonResponse({'success': False, 'error': 'No se ha iniciado sesión correctamente.'})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})




def Roles(request): #define los roles
    user_id = request.session.get('user_id')
    if user_id:
        try:
            usuario_bd = Usuario.objects.get(id_usuario=user_id)
            rol_usuario = usuario_bd.rol_usuario
            return JsonResponse({'rol_usuario': rol_usuario})
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Error al recuperar los datos del usuario.'}, status=400)
    else:
        return JsonResponse({'error': 'No se ha iniciado sesión correctamente.'}, status=400)
    
def add_pedido_parte(request): #añade los pedido parte a los pedidos
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        pedido_id = request.POST.get('pedido_id')
        cantidad_prod = int(request.POST.get('cantidad_prod'))
        cantidad_cajas = int(request.POST.get('cantidad_cajas'))
        precio = float(request.POST.get('precio'))
        id_empaque = int(request.POST.get('empaque'))
        id_producto = int(request.POST.get('producto'))

        if not pedido_id:
            return JsonResponse({'success': False, 'error': 'El ID del pedido es requerido'})

        try:
            with transaction.atomic():
                producto = Producto.objects.select_for_update().get(id_producto=id_producto)

              
                if producto.stock < cantidad_cajas * cantidad_prod:
                    return JsonResponse({'success': False, 'error': 'No hay suficiente producto disponible'})

              
                producto.stock -= cantidad_cajas * cantidad_prod
                producto.save()

                pedido_parte = PedidoParte(
                    id_pedido_id=pedido_id,
                    cantidad_prod=cantidad_prod,
                    cantidad_cajas=cantidad_cajas,
                    precio=precio,
                    id_empaque_id=id_empaque,
                    id_producto_id=id_producto
                )
                pedido_parte.save()

            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)
    
def get_pedido_parte(request): #obtiene el pedido parte
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        try:
            data = json.loads(request.body)
            pedido_id = data.get('pedido_id')

            if not pedido_id:
                return JsonResponse({'success': False, 'error': 'El ID del pedido es requerido'})

            pedido_partes = PedidoParte.objects.filter(id_pedido=pedido_id)
            pedido_partes_list = []

            for parte in pedido_partes:
                empaque_nombre = parte.id_empaque.nombre  # Obtener el nombre del empaque
                pedido_partes_list.append({
                    'id_pedido_par': parte.id_pedido_par,
                    'cantidad_prod': parte.cantidad_prod,
                    'producto': parte.id_producto.nombre_producto,
                    'cantidad_cajas': parte.cantidad_cajas,
                    'empaque': empaque_nombre  # Usar el nombre del empaque
                })

            return JsonResponse({'success': True, 'pedido_partes': pedido_partes_list})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)
    
def delete_pedido_parte(request):# Elimina pedido parte
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        try:
            data = json.loads(request.body)
            pedido_parte_id = data.get('id_pedido_par')

            if not pedido_parte_id:
                return JsonResponse({'success': False, 'error': 'El ID del pedido parte es requerido'})

            pedido_parte = PedidoParte.objects.get(id_pedido_par=pedido_parte_id)
            producto = Producto.objects.get(id_producto=pedido_parte.id_producto_id)

            # Restaurar la cantidad de producto al inventario
            producto.stock += pedido_parte.cantidad_prod * pedido_parte.cantidad_cajas
            producto.save()

            pedido_parte.delete()

            return JsonResponse({'success': True})
        except PedidoParte.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'El pedido parte no existe'})
        except Producto.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'El producto no existe'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)
    
def delete_order(request): #elimina la orden
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            pedido_id = body.get('pedido_id')

            if not pedido_id:
                return JsonResponse({'success': False, 'error': 'ID del pedido no proporcionado'})

            with transaction.atomic():
                try:
                    pedido = Pedido.objects.select_for_update().get(id_pedido=pedido_id)
                    pedido_partes = PedidoParte.objects.filter(id_pedido=pedido)

                    for pedido_parte in pedido_partes:
                        producto = Producto.objects.get(id_producto=pedido_parte.id_producto_id)

                        
                        producto.stock += pedido_parte.cantidad_prod * pedido_parte.cantidad_cajas
                        producto.save()

                        
                        pedido_parte.delete()

                    
                    pedido.delete()
                    return JsonResponse({'success': True, 'mensaje': 'Pedido y sus partes eliminados correctamente'})
                except Pedido.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Pedido no encontrado'})
                except Producto.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Uno de los productos de la orden no existe'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Error al decodificar JSON'})
    return JsonResponse({'success': False, 'error': 'Método de solicitud no válido'})