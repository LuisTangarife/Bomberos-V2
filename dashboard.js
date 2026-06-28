/*============================================
 DASHBOARD V2
=============================================*/

document.addEventListener("DOMContentLoaded", () => {

    renderSidebar("dashboard");

    renderHeader("Dashboard");

    iniciarSistema();

    cargarDashboard();

});

/*=============================================
 CARGAR DATOS
=============================================*/

function cargarDashboard(){

    // Temporal

    document.getElementById("statEmergencias").innerHTML="0";

    document.getElementById("statAPH").innerHTML="0";

    document.getElementById("statInspecciones").innerHTML="0";

    document.getElementById("statAyudas").innerHTML="0";

}

/*=============================================
 NAVEGACIÓN
=============================================*/

function abrirEmergencias() {
    location.href = "modules/emergencia/index.html";
}

function abrirAPH(){

    alert("Próximamente");

}

function abrirAyudas(){

    alert("Próximamente");

}

function abrirInspecciones(){

    location.href = "modules/inspecciones/index.html";

}

function abrirEstadisticas(){

    alert("Próximamente");

}
