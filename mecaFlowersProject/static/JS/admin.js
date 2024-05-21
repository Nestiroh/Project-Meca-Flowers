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

function getCookie(name) {
    var value = document.getElementById('csrf-token').value;
    return value;
  }

  function mostrarOcultar(x) {
    $.ajax({
        url: '/mecaControl/Roles/',
        type: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        success: function (response) {
            if (response.error) {
                alert(response.error);
                return;
            }
            const user_Rol = response.rol_usuario;
            const form = document.getElementById(x);

            for (var i = 0; i <= 6; i++) {
                if (i != x) {
                    document.getElementById(i).style.display = 'none';
                    resetFormValues();
                    document.getElementById("agregar").style.display = 'none';
                    document.getElementById("eliminar").style.display = 'none';
                    document.getElementById("editar").style.display = 'none';
                }
            }

            switch (user_Rol) {
                case "Administrador":
                    if (form.style.display === 'none') {
                        form.style.display = 'block';
                    } else {
                        form.style.display = 'none';
                        document.getElementById(0).style.display = 'block';
                    }
                    break;
                case "Secretario":
                    if (form.style.display === 'none') {
                        if (x != 1) {
                            form.style.display = 'block';
                        } else {
                            alert("No tiene permitido ingresar a esta pagina");
                            document.getElementById(0).style.display = 'block';
                        }
                    } else {
                        form.style.display = 'none';
                        document.getElementById(0).style.display = 'block';
                    }
                    break;
                case "Conductor":
                    if (form.style.display === 'none') {
                        if (x === 0 || x === 5 || x === 6) {
                            form.style.display = 'block';
                        } else {
                            alert("No tiene permitido ingresar a esta pagina");
                            document.getElementById(0).style.display = 'block';
                        }
                    } else {
                        form.style.display = 'none';
                        document.getElementById(0).style.display = 'block';
                    }
                    break;
                default:
                    alert("Rol de usuario no reconocido.");
                    document.getElementById(0).style.display = 'block';
            }

        },
        error: function (xhr, errmsg, err) {
            alert("Error al obtener los datos del rol del usuario.");
        }
    });
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
        event.preventDefault(); 
    
        var formData = $(this).serialize();
    
        $.ajax({
            type: 'POST',
            url: '/mecaControl/agregar_usuario/',  
            data: formData,
            success: function(response) {
                
                alert(response.message);
                resetFormValues();
            },
            error: function(xhr, status, error) {
             
                var response = JSON.parse(xhr.responseText);
                alert(response.error);
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

document.addEventListener('DOMContentLoaded', function () {//adminsitrar entidades y conductores
    const addOrderBtn = document.getElementById('add-order-btn');
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('order-form');
    const entidadOption = document.getElementById('entidad-option');
    const entidadExistente = document.getElementById('entidad-existente');
    const entidadNueva = document.getElementById('entidad-nueva');

    addOrderBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        loadConductores();
        loadEntidades();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    entidadOption.addEventListener('change', function () {
        if (this.value === 'existente') {
            entidadExistente.style.display = 'block';
            entidadNueva.style.display = 'none';
        } else if (this.value === 'nueva') {
            entidadExistente.style.display = 'none';
            entidadNueva.style.display = 'block';
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        fetch('/mecaControl/create-order/', {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.mensaje);
                window.location.reload();
                modal.style.display = 'none';
            } else {
                alert('Error al crear el pedido: ' + data.error);
            }
        });
    });

    function loadConductores() {
        fetch('/mecaControl/get_conductores/')
            .then(response => response.json())
            .then(data => {
                const conductorSelect = document.getElementById('conductor');
                conductorSelect.innerHTML = '';
                data.conductores.forEach(conductor => {
                    const option = document.createElement('option');
                    option.value = conductor.id_usuario;
                    option.textContent = conductor.nombre;
                    conductorSelect.appendChild(option);
                });
            });
    }

    function loadEntidades() {
        fetch('/mecaControl/get_entidades/')
            .then(response => response.json())
            .then(data => {
                const entidadSelect = document.getElementById('entidad');
                entidadSelect.innerHTML = '';
                data.entidades.forEach(entidad => {
                    const option = document.createElement('option');
                    option.value = entidad.id_entidad;
                    option.textContent = entidad.nombre_entidad;
                    entidadSelect.appendChild(option);
                });

                // Capturar el ID de la última entidad creada y seleccionarla automáticamente
                if (data.entidades.length > 0) {
                    const lastEntityId = data.entidades[data.entidades.length - 1].id_entidad;
                    entidadSelect.value = lastEntityId;
                }
            });
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




document.addEventListener('DOMContentLoaded', function() { //Parte de agregar al pedido pedido parte
    const modal = document.getElementById('pedido-parte-modal');
    const closeBtn = document.querySelector('.close-btn');
    const addItemBtns = document.querySelectorAll('.add-item-btn');
    const form = document.getElementById('pedido-parte-form');

    addItemBtns.forEach(button => {
        button.addEventListener('click', function() {
            const pedidoId = this.closest('tr').getAttribute('data-id');
            document.getElementById('pedido-id').value = pedidoId; 
            modal.style.display = 'block';
        });
    });
 
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        
        fetch('/mecaControl/add_pedido_parte/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Pedido parte agregado correctamente');
                modal.style.display = 'none';
                form.reset();
            } else {
                alert('Error al agregar pedido: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

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

document.addEventListener('DOMContentLoaded', function() {//Funcion para ver los pedido parte asociados
    const viewItemsBtns = document.querySelectorAll('.view-items-btn');
    const viewModal = document.getElementById('view-pedido-parte-modal');
    const pedidoParteTableBody = document.getElementById('pedido-parte-table-body');
    const closeBtn = viewModal.querySelector('.close-btn');

    viewItemsBtns.forEach(button => {
        button.addEventListener('click', function() {
            const pedidoId = this.closest('tr').getAttribute('data-id');

            fetch('/mecaControl/get_pedido_parte/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ pedido_id: pedidoId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    pedidoParteTableBody.innerHTML = '';
                    data.pedido_partes.forEach(parte => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${parte.cantidad_prod}</td>
                            <td>${parte.producto}</td>
                            <td>${parte.cantidad_cajas}</td>
                            <td>${parte.empaque}</td>
                            <td><button class="delete-item-btn" data-id="${parte.id_pedido_par}">Eliminar</button></td>
                        `;
                        pedidoParteTableBody.appendChild(row);
                    });
                    viewModal.style.display = 'block';
                } else {
                    alert('Error al cargar los detalles del pedido: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los detalles del pedido: ' + error);
            });
        });
    });

    closeBtn.addEventListener('click', function() {
        viewModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === viewModal) {
            viewModal.style.display = 'none';
        }
    });

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


document.addEventListener('DOMContentLoaded', function() {//Ver los pedido parte y eliminarlos
    const viewItemsBtns = document.querySelectorAll('.view-items-btn');
    const viewModal = document.getElementById('view-pedido-parte-modal');
    const pedidoParteTableBody = document.getElementById('pedido-parte-table-body');
    const closeBtn = viewModal.querySelector('.close-btn');

    viewItemsBtns.forEach(button => {
        button.addEventListener('click', function() {
            const pedidoId = this.closest('tr').getAttribute('data-id');

            fetch('/mecaControl/get_pedido_parte/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ pedido_id: pedidoId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    pedidoParteTableBody.innerHTML = '';
                    data.pedido_partes.forEach(parte => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${parte.cantidad_prod}</td>
                            <td>${parte.producto}</td>
                            <td>${parte.cantidad_cajas}</td>
                            <td>${parte.empaque}</td>
                            <td><button class="delete-item-btn" data-id="${parte.id_pedido_par}">Devolver</button></td>
                        `;
                        pedidoParteTableBody.appendChild(row);
                    });

                    // Add event listeners for delete buttons
                    const deleteItemBtns = document.querySelectorAll('.delete-item-btn');
                    deleteItemBtns.forEach(button => {
                        button.addEventListener('click', function() {
                            const pedidoParteId = this.getAttribute('data-id');
                            fetch('/mecaControl/delete_pedido_parte/', {
                                method: 'POST',
                                headers: {
                                    'X-CSRFToken': getCookie('csrftoken'),
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                body: JSON.stringify({ id_pedido_par: pedidoParteId })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    this.closest('tr').remove();
                                    alert('Pedido parte eliminado correctamente');
                                } else {
                                    alert('Error al eliminar pedido parte: ' + data.error);
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Error al eliminar pedido parte: ' + error);
                            });
                        });
                    });

                    viewModal.style.display = 'block';
                } else {
                    alert('Error al cargar los detalles del pedido: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los detalles del pedido: ' + error);
            });
        });
    });

    closeBtn.addEventListener('click', function() {
        viewModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === viewModal) {
            viewModal.style.display = 'none';
        }
    });

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