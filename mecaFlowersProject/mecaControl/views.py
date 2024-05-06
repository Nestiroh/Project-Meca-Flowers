from django.shortcuts import render, redirect
from .forms import LoginForm
from .models import Usuario 
from django.contrib.auth.decorators import login_required

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Usuario
from .forms import LoginForm

def login(request):
    error_message = None
    inicio_content = None  # Contenido de la vista 'inicio'

    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            contrasena = form.cleaned_data['contrasena']

            try:
                usuario_bd = Usuario.objects.get(email=email)
                
                if contrasena == usuario_bd.contrasena:
                    request.session['user_id'] = usuario_bd.id_usuario
                    # Si el inicio de sesión es exitoso, definimos el contenido de la vista 'admin.html'
                    inicio_content = {
                        'nombre_usuario': usuario_bd.nombre,
                        'rol_usuario': usuario_bd.rol_usuario
                    }
                    return render(request, 'Admin.html', inicio_content)
                else:
                    error_message = "Usuario o contraseña incorrectos."
            except Usuario.DoesNotExist:
                error_message = "El usuario no existe."
        else:
            error_message = "Por favor, corrija los datos."
    else:
        form = LoginForm()

    # Renderizamos el formulario de inicio de sesión en caso de que no se haya iniciado sesión aún
    return render(request, 'Usuario.html', {'form': form, 'error_message': error_message})


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
    return render(request, 'Admin.html', {})