import {
    guardarInspeccion,
    subirFotoStorage,
    generarConsecutivo,
    listarInspecciones,
    eliminarInspeccion
} from "./firebase.js";

/* =========================================================
   APP INSPECCIONES V2
========================================================= */

/* =========================================================
   ESTADO GLOBAL
========================================================= */

let inspeccionActual = null;
let evidencias = [];
let modoEdicion = false;

/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const dashboard = document.getElementById("inspectionDashboard");

const vistaListado = document.getElementById("vistaListado");

const vistaFormulario = document.getElementById("vistaFormulario");

const wizard = document.getElementById("inspectionWizard");

const formulario = document.getElementById("inspectionForm");

const btnNuevaInspeccion = document.getElementById("btnNuevaInspeccion");

/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", iniciarApp);

async function iniciarApp() {

    establecerFechaHora();

    configurarProgreso();

    configurarScrollTop();

    configurarMenu();

    configurarFotos();

    configurarFirmas();

    configurarAutoGuardado();

    configurarEventos();

    await prepararNuevaInspeccion();

    await cargarListado();

    mostrarDashboard();

}

/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    if (btnNuevaInspeccion) {

        btnNuevaInspeccion.addEventListener(
            "click",
            nuevaInspeccion
        );

    }

    if (formulario) {

        formulario.addEventListener(
            "submit",
            guardarFormulario
        );

    }

}

/* =========================================================
   LISTADO
========================================================= */

async function cargarListado() {

    if (typeof cargarInspecciones !== "function") return;

    await listarInspecciones();

}
/* =========================================================
   NAVEGACIÓN ENTRE VISTAS
========================================================= */

function mostrarDashboard() {

    if (dashboard)
        dashboard.style.display = "block";

    if (vistaListado)
        vistaListado.classList.add("activa");

    if (vistaFormulario)
        vistaFormulario.classList.remove("activa");

    if (wizard)
        wizard.style.display = "none";

}

function mostrarFormulario() {

    if (dashboard)
        dashboard.style.display = "none";

    if (vistaListado)
        vistaListado.classList.remove("activa");

    if (vistaFormulario)
        vistaFormulario.classList.add("activa");

    if (wizard)
        wizard.style.display = "block";

    actualizarProgreso();

}

async function nuevaInspeccion() {

    await reiniciarFormulario();

    mostrarFormulario();

}

async function editarInspeccion(inspeccion) {

    inspeccionActual = inspeccion;

    modoEdicion = true;

    cargarFormulario(inspeccion);

    mostrarFormulario();

}

async function regresarListado() {

    await cargarListado();

    mostrarDashboard();

}

/* =========================================================
   FORMULARIO
========================================================= */

function obtenerValor(id) {

    const elemento = document.getElementById(id);

    if (!elemento)
        return "";

    if (elemento.type === "checkbox")
        return elemento.checked;

    return elemento.value.trim();

}

function asignarValor(id, valor) {

    const elemento = document.getElementById(id);

    if (!elemento)
        return;

    if (elemento.type === "checkbox") {

        elemento.checked = !!valor;

        return;

    }

    elemento.value = valor ?? "";

}

function construirInspeccion() {

    return {

        id: inspeccionActual?.id || null,

        consecutivo: obtenerValor("numeroInspeccion"),

        fecha: obtenerValor("fecha"),

        hora: obtenerValor("hora"),

        estado: obtenerValor("estado"),

        tipoInspeccion: obtenerValor("tipoInspeccion"),

        establecimiento: obtenerValor("establecimiento"),

        nit: obtenerValor("nit"),

        direccion: obtenerValor("direccion"),

        barrio: obtenerValor("barrio"),

        telefono: obtenerValor("telefono"),

        correo: obtenerValor("correo"),

        propietario: obtenerValor("propietario"),

        representante: obtenerValor("representante"),

        municipio: obtenerValor("municipio"),

        inspector: obtenerValor("inspector"),

        acompanante: obtenerValor("acompanante"),

        recomendaciones: obtenerValor("recomendaciones"),

        observaciones: obtenerValor("observacionesFinales"),

        conclusion: obtenerValor("conclusion"),

        resultado: obtenerValor("resultado"),

        fechaRegistro: new Date().toISOString(),

        evidencias: [...evidencias],

        firmas: {

            inspector: obtenerFirma("firmaInspector"),

            representante: obtenerFirma("firmaRepresentante")

        }

    };

}

function cargarFormulario(inspeccion) {

    asignarValor("numeroInspeccion", inspeccion.consecutivo);

    asignarValor("fecha", inspeccion.fecha);

    asignarValor("hora", inspeccion.hora);

    asignarValor("estado", inspeccion.estado);

    asignarValor("tipoInspeccion", inspeccion.tipoInspeccion);

    asignarValor("establecimiento", inspeccion.establecimiento);

    asignarValor("nit", inspeccion.nit);

    asignarValor("direccion", inspeccion.direccion);

    asignarValor("barrio", inspeccion.barrio);

    asignarValor("telefono", inspeccion.telefono);

    asignarValor("correo", inspeccion.correo);

    asignarValor("propietario", inspeccion.propietario);

    asignarValor("representante", inspeccion.representante);

    asignarValor("municipio", inspeccion.municipio);

    asignarValor("inspector", inspeccion.inspector);

    asignarValor("acompanante", inspeccion.acompanante);

    asignarValor("recomendaciones", inspeccion.recomendaciones);

    asignarValor("observacionesFinales", inspeccion.observaciones);

    asignarValor("conclusion", inspeccion.conclusion);

    asignarValor("resultado", inspeccion.resultado);

    evidencias = inspeccion.evidencias || [];

    renderFotos();

    actualizarProgreso();

}

function validarFormulario() {

    const obligatorios = [

        "fecha",

        "tipoInspeccion",

        "establecimiento",

        "direccion"

    ];

    for (const id of obligatorios) {

        const campo = document.getElementById(id);

        if (!campo)
            continue;

        if (campo.value.trim() === "") {

            campo.focus();

            throw new Error("Complete todos los campos obligatorios.");

        }

    }

}

async function prepararNuevaInspeccion() {

    inspeccionActual = null;

    modoEdicion = false;

    const consecutivo = await generarConsecutivo();

    asignarValor("numeroInspeccion", consecutivo);

}

async function reiniciarFormulario() {

    formulario.reset();

    evidencias = [];

    renderFotos();

    limpiarFirma("firmaInspector");

    limpiarFirma("firmaRepresentante");

    establecerFechaHora();

    await prepararNuevaInspeccion();

    actualizarProgreso();

}

/* =========================================================
   GUARDAR INSPECCIÓN
========================================================= */

async function guardarFormulario(e) {

    e.preventDefault();

    try {

        validarFormulario();

        const boton = e.submitter;

        if (boton) {

            boton.disabled = true;

            boton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Guardando...
            `;

        }

        const inspeccion = construirInspeccion();

        /* ==========================================
           SUBIR EVIDENCIAS
        ========================================== */

        const fotosStorage = [];

        for (const foto of evidencias) {

            if (foto.archivo) {

                const subida = await subirFotoStorage(

                    inspeccion.consecutivo,

                    foto

                );

                fotosStorage.push(subida);

            }

            else {

                fotosStorage.push(foto);

            }

        }

        inspeccion.evidencias = fotosStorage;

        /* ==========================================
           GUARDAR EN FIREBASE
        ========================================== */

        await guardarInspeccion(

            inspeccion.consecutivo,

            inspeccion

        );

        alert("Inspección guardada correctamente.");

        await reiniciarFormulario();

        await cargarListado();

        mostrarDashboard();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    finally {

        const boton = e.submitter;

        if (boton) {

            boton.disabled = false;

            boton.innerHTML = `
                <i class="fa-solid fa-floppy-disk"></i>
                Guardar Inspección
            `;

        }

    }

}

/* =========================================================
   ELIMINAR
========================================================= */

async function borrarInspeccion(id) {

    if (!confirm("¿Desea eliminar esta inspección?"))
        return;

    try {

        await eliminarInspeccion(id);

        await cargarListado();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

/* =========================================================
   EDITAR
========================================================= */

async function abrirEdicion(inspeccion) {

    inspeccionActual = inspeccion;

    modoEdicion = true;

    cargarFormulario(inspeccion);

    mostrarFormulario();

}

/* =========================================================
   CANCELAR
========================================================= */

async function cancelarFormulario() {

    await reiniciarFormulario();

    mostrarDashboard();

}

/* =========================================================
   EXPONER FUNCIONES
========================================================= */

window.editarInspeccion = abrirEdicion;

window.eliminarInspeccion = borrarInspeccion;

window.cancelarFormulario = cancelarFormulario;

window.subirFoto = subirFoto;

window.bajarFoto = bajarFoto;

window.eliminarFoto = eliminarFoto;
