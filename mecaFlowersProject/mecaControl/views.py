from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .forms import LoginForm
from .models import Usuario  # Importa el modelo de Usuario o el modelo que contenga el correo electrónico
from django.contrib.auth.hashers import check_password

def login(request):
    error_message = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            contrasena = form.cleaned_data['contrasena']

            try:
                usuario_bd = Usuario.objects.get(email=email)
                print(f'Correo electrónico de la base de datos: {usuario_bd.contrasena}')
                
                if contrasena == usuario_bd.contrasena:
                    print('Contraseña válida')
                    request.session['user_id'] = usuario_bd.id_usuario
                    return redirect('adminis')
                else:
                    print('Contraseña incorrecta')
                    error_message = "Usuario o contraseña incorrectos."
            except Usuario.DoesNotExist:
                error_message = "El usuario no existe."
        else:
            error_message = "Por favor, corrija los datos."
    else:
        form = LoginForm()
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