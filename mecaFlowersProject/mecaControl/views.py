from django.shortcuts import render, redirect
from .forms import LoginForm
from .models import Usuario 
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.models import User
from django.http import JsonResponse
    

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
        # Obtener datos del formulario
        nombre_usuario = request.POST.get('nombre_usuario')
        correo = request.POST.get('correo')
        contraseña = request.POST.get('contraseña')
        rol = request.POST.get('rol')
        telefono = request.POST.get('telefono')

        if nombre_usuario and correo and contraseña and rol and telefono:
            nuevo_usuario = Usuario(
                nombre=nombre_usuario,
                email=correo,
                contrasena=contraseña,  
                rol_usuario=rol,
                telefono=telefono
            )
            
            nuevo_usuario.save()
            messages.add_message(request, messages.SUCCESS, 'Usuario agregado correctamente.')
               
            # Respuesta JSON exitosa con mensaje personalizado
            respuesta = {     
            "exito": True,
            }
            return JsonResponse(respuesta)
        
        else:
            # Respuesta JSON con errores y mensaje personalizado
            respuesta = {
                "exito": False,
                "mensaje": "Hubo un problema al agregar el usuario. Verifica los campos e intenta nuevamente.",
                "errores": {
                    "nombre_usuario": "Este campo es obligatorio." if not nombre_usuario else "",
                    "correo": "Este campo es obligatorio." if not correo else "",
                    "contraseña": "Este campo es obligatorio." if not contraseña else "",
                    "rol": "Este campo es obligatorio." if not rol else "",
                    "telefono": "Este campo es obligatorio." if not telefono else "",
                }
            }
        
        return JsonResponse(respuesta)
    else:
        return render(request, 'Admin.html')

def eliminar_usuario(request):
    if request.method == 'POST':
        correo_usuario = request.POST.get('correo')
        
        if correo_usuario:
            try:
                usuario = User.objects.get(email=correo_usuario)
                usuario.delete()
                respuesta = {
                    'exito': True,
                    'mensaje': f'Usuario con correo {correo_usuario} eliminado correctamente.'
                }
            except User.DoesNotExist:
                respuesta = {
                    'exito': False,
                    'mensaje': f'No se encontró ningún usuario con el correo {correo_usuario}.'
                }
        else:
            respuesta = {
                'exito': False,
                'mensaje': 'El correo del usuario es necesario para eliminarlo.'
            }
        
        return JsonResponse(respuesta)
    else:
        
        respuesta = {
            'exito': False,
            'mensaje': 'Método no permitido. Utiliza una solicitud POST para eliminar un usuario.'
        }
        return JsonResponse(respuesta, status=405)  # Método no permitido

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