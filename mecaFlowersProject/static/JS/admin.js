const toggle = document.querySelector(".toggle");
const menuDashboard = document.querySelector(".menu-dashboard");
const iconoMenu = toggle.querySelector("i");
const enlacesMenu = document.querySelectorAll(".enlace");

const formularioRegistroUsuario = document.getElementById('formularioUsuario');
const mensajeResultado = document.getElementById('mensaje-resultado');

toggle.addEventListener("click", () => {
    menuDashboard.classList.toggle("open");

    if (iconoMenu.classList.contains("bx-menu")) {
        iconoMenu.classList.replace("bx-menu", "bx-x");
    } else {
        iconoMenu.classList.replace("bx-x", "bx-menu");
    }
});

enlacesMenu.forEach(enlace => {
    enlace.addEventListener("click", () => {
        menuDashboard.classList.add("open");
        iconoMenu.classList.replace("bx-menu", "bx-x");
    });
});

function mostrarOcultar(x) {
    
    for (var i = 0; i <= 6; i++) {
        if (i != x) {
            document.getElementById(i).style.display = 'none';
            resetFormValues();
            document.getElementById("agregar").style.display='none'
            document.getElementById("eliminar").style.display='none'
            document.getElementById("editar").style.display='none'
        }
    }
    const form = document.getElementById(x);
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
        document.getElementById(0).style.display = 'block';
    }
}

function mostrarCampos(identificador) {
    // Ocultar todos los formularios primero
    document.querySelectorAll('.form').forEach(form => {
        form.style.display = 'none';
    });

    // Restablecer los valores de los campos a default
    resetFormValues();

    // Mostrar el formulario correspondiente
    var campos = document.getElementById(identificador);
    campos.style.display = 'block';
}

function resetFormValues() { //Resetear los valores a 0 de la administracion de usuarios
    document.getElementById('nombreUsuario').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('contraseña').value = '';
    const ningunoOption = document.querySelector('#rol option[value=""]');
    ningunoOption.selected = true;
    document.getElementById('telefono').value = '';
    
    document.getElementById('correoUsuario').value = '';
    
    document.getElementById('nombreUsuarioEdit').value = '';
    document.getElementById('correoEdit').value = '';
    document.getElementById('contraseñaEdit').value = '';
}

$(document).ready(function() {//Agregar usuario con AJAX
    $('#formularioUsuario').submit(function(event) {
        event.preventDefault(); // Evitar el envío normal del formulario

        var formData = $(this).serialize();

        // Realizar la petición Ajax con la URL correspondiente para agregar usuario
        $.ajax({
            type: 'POST',
            url: '/mecaControl/agregar_usuario/',  // URL de la vista para agregar usuario
            data: formData,
            success: function(response) {
                // Manejar la respuesta aquí, por ejemplo mostrar un mensaje de éxito
                alert(response.message);
                resetFormValues();
            },
            error: function(xhr, status, error) {
                // Manejar errores si los hay
                console.error(xhr.responseText);
            }
        });
    });

    $('#formularioEliminarUsuario').submit(function(event) {//Eliminar usuario con AJAX
        event.preventDefault(); // Evitar el envío normal del formulario

        var formData = $(this).serialize();

        // Realizar la petición Ajax con la URL correspondiente para eliminar usuario
        $.ajax({
            type: 'POST',
            url: '/mecaControl/eliminar_usuario/',  // URL de la vista para eliminar usuario
            data: formData,
            success: function(response) {
                // Manejar la respuesta aquí, por ejemplo mostrar un mensaje de éxito
                alert(response.message);
                resetFormValues();
            },
            error: function(xhr, status, error) {
                // Manejar errores si los hay
                console.error(xhr.responseText);
            }
        });
    });
});
