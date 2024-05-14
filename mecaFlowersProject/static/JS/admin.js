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

function mostrarOcultar(x) {//Mostrar ocultar en funcion de los botones
    
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

function mostrarCampos(identificador) {//Muestra campos
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

$(document).ready(function() { // TODAS las funciones para el editar usuario

    // Función para abrir la ventana modal
    function openModal() {
        $('#editarUsuarioModal').css('display', 'block');
    }

    // Función para cerrar la ventana modal
    function closeModal() {
        $('#editarUsuarioModal').css('display', 'none');
    }

    // Manejar el clic en el botón de cerrar
    $('.close').click(function() {
        closeModal();
    });

    // Cerrar la ventana modal cuando el usuario haga clic fuera del contenido de la modal
    $(window).click(function(event) {
        if ($(event.target).is('#editarUsuarioModal')) {
            closeModal();
        }
    });

    function cargarDatosUsuario(usuarioId) {
        $.ajax({
            type: 'GET',
            url: `/mecaControl/obtener_usuario/${usuarioId}/`,
            success: function(response) {
                const usuario = response.usuario;
                $('#editarIdUsuario').val(usuario.id_usuario);
                $('#editarNombre').val(usuario.nombre);
                $('#editarEmail').val(usuario.email);
                $('#editarRol').val(usuario.rol_usuario);
                openModal();
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    }

    // Función para cargar usuarios y manejar la edición
    function cargarUsuarios() {
        $.ajax({
            type: 'GET',
            url: '/mecaControl/cargar_usuarios/',
            success: function(response) {
                const usuarios = response.usuarios;
                const tablaUsuariosBody = $('#tablaUsuarios tbody');
                tablaUsuariosBody.empty();

                usuarios.forEach(usuario => {
                    tablaUsuariosBody.append(`
                        <tr data-id="${usuario.id_usuario}" class="usuario-row">
                            <td>${usuario.nombre}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.rol_usuario}</td>
                            <td><button class="editar-btn">Editar</button></td>
                        </tr>
                    `);
                });

                // Agregar evento click para botón de editar
                $('.editar-btn').click(function() {
                    const usuarioId = $(this).closest('tr').data('id');
                    cargarDatosUsuario(usuarioId);
                });
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    }

    cargarUsuarios();  

    // Manejar el envío del formulario de edición
    $('#formularioEditarUsuario').submit(function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma convencional
    
        const formData = $(this).serialize(); // Obtener los datos del formulario

        $.ajax({
            type: 'POST',
            url: '/mecaControl/guardar_usuario/',
            data: formData,
            success: function(response) {
                alert(response.mensaje);
                closeModal(); // Cerrar la ventana modal después de guardar
                cargarUsuarios(); // Recargar la tabla con los usuarios actualizados
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });

});



