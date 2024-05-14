from django.shortcuts import render, redirect
from .forms import LoginForm
from .models import Usuario 
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
import json

def login(request):
    error_message = None

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            contrasena = form.cleaned_data['contrasena']

            try:
                usuario_bd = Usuario.objects.get(email=email)
    
                if contrasena == usuario_bd.contrasena:
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
        nombre = request.POST.get('nombre_usuario')  # Corregido
        email = request.POST.get('correo')  # Corregido
        contrasena = request.POST.get('contraseña')  # Corregido
        rol_usuario = request.POST.get('rol')  # Corregido
        telefono = request.POST.get('telefono')  # Corregido

        usuario = Usuario(nombre=nombre, email=email, contrasena=contrasena, rol_usuario=rol_usuario, telefono=telefono)  # Corregido
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
            return render(request, 'Admin.html', {'nombre_usuario': nombre_usuario, 'rol_usuario': rol_usuario})
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