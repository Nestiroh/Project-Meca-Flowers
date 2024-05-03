const toggle = document.querySelector(".toggle")
const menuDashboard = document.querySelector(".menu-dashboard")
const iconoMenu = toggle.querySelector("i")
const enlacesMenu = document.querySelectorAll(".enlace")

toggle.addEventListener("click", () => {
    menuDashboard.classList.toggle("open")

    if (iconoMenu.classList.contains("bx-menu")) {
        iconoMenu.classList.replace("bx-menu", "bx-x")
    } else {
        iconoMenu.classList.replace("bx-x", "bx-menu")
    }
})

enlacesMenu.forEach(enlace => {
    enlace.addEventListener("click", () => {
        menuDashboard.classList.add("open")
        iconoMenu.classList.replace("bx-menu", "bx-x")
    })
})

function mostrarOcultar(x) {

    for(var i=1;i<=6;i++){
        if(i!=x){
            document.getElementById(i).style.display = 'none';
        }
    }
    if (document.getElementById(x).style.display == 'none') {
        document.getElementById(x).style.display = 'block';
    } else {
        document.getElementById(x).style.display = 'none';
    }
}