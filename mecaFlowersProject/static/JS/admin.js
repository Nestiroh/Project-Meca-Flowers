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

$(document).ready(function() {  // Obtener la cantidad de stock al cargar la página
    $('.about_icons').each(function() {
        var productId = $(this).data('product-id'); // Obtener el id del producto
        var stockValue = $(this).find('#stock_value'); // Elemento donde se mostrará el stock

        $.ajax({
            url: '/mecaControl/get_stock/?product_id=' + productId,
            type: 'GET',
            success: function(response) {
                stockValue.text(response.stock);
            },
            error: function(xhr, errmsg, err) {
                console.log(xhr.status + ": " + xhr.responseText);
                // Manejar errores aquí si es necesario
            }
        });
    });

});

$(document).ready(function() {//Funcion para actualiza el stock con los botones 
    $('.about_icons').each(function() {
        var productId = $(this).data('product-id'); // Obtener el id del producto
        var stockValue = $(this).find('#stock_value'); // Elemento donde se mostrará el stock
        var quantityChangeInput = $(this).find('#quantity_change_input'); // Campo de entrada para ingresar la cantidad

        // Función para actualizar el stock restante al hacer clic en los botones "plus" y "minus"
        $(this).on('click', '.bx-plus, .bx-minus', function() {
            var quantityChange = parseInt(quantityChangeInput.val());
            var currentQuantity = parseInt(stockValue.text());
            var newQuantity;

            if ($(this).hasClass('bx-plus')) {
                newQuantity = currentQuantity + quantityChange;
            } else {
                newQuantity = currentQuantity - quantityChange;
                if (newQuantity < 0) newQuantity = 0; 
            }

            updateStock(productId, newQuantity);
        });

        // Función para enviar la cantidad actualizada al servidor
        function updateStock(productId, newQuantity) {
            $.ajax({
                url: '/mecaControl/update_stock/',  // URL para actualizar el stock
                type: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') }, 
                data: {
                    product_id: productId,
                    new_quantity: newQuantity
                },
                success: function(response) {
                    if (response.success) {
                        stockValue.text(newQuantity); // Actualizar el stock que se esta msotrando
                    } else {
                        alert('Error al actualizar el stock.');
                    }
                },
                error: function(xhr, errmsg, err) {
                    console.log(xhr.status + ": " + xhr.responseText);
                    alert('Error al actualizar el stock.');
                }
            });
            
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            
        }
    });
});

////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
    const addOrderBtn = document.getElementById('add-order-btn');
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('order-form');
    const orderTableBody = document.getElementById('order-table-body'); // Agrega esta línea para obtener la tabla

    addOrderBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        
        fetch('/mecaControl/create-order/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.mensaje);  // Muestra el mensaje de éxito
                window.location.reload(); 
                modal.style.display = 'none';
            } else {
                alert('Error al crear el pedido');
            }
        });
    });

    function addOrderToTable(order) {//Funcion invalida
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id_pedido}</td>
            <td>${order.fecha_pedido}</td>
            <td>${order.nombre_usuario}</td>
            <td>${order.total}</td>
            <td>${order.estado}</td>
            <td><button class="add-item-btn">Agregar</button></td>
        `;
        orderTableBody.appendChild(row); 
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});






