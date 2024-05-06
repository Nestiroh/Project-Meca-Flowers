const toggle = document.querySelector(".toggle");
const menuDashboard = document.querySelector(".menu-dashboard");
const iconoMenu = toggle.querySelector("i");
const enlacesMenu = document.querySelectorAll(".enlace");

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
    
    const form = document.getElementById(x);
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
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

function resetFormValues() {
    document.getElementById('nombreUsuario').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('contraseña').value = '';
    document.getElementById('rol').selectedIndex = 0;
    document.getElementById('telefono').value = '';
    
    document.getElementById('correoUsuario').value = '';
    
    document.getElementById('nombreUsuarioEdit').value = '';
    document.getElementById('correoEdit').value = '';
    document.getElementById('contraseñaEdit').value = '';
}

