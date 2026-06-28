/* =========================================================
   APP INSPECCIONES
========================================================= */

document.addEventListener("DOMContentLoaded", init);

function init(){

    establecerFechaHora();

    generarConsecutivo();

    configurarProgreso();

    configurarScrollTop();

    configurarMenu();

    configurarFotos();

    configurarFirmas();

    configurarAutoGuardado();

  
}
/* =========================================================
   FECHA Y HORA
========================================================= */

function establecerFechaHora(){

    const hoy =
    new Date();

    const fecha =
    document.getElementById("fecha");

    const hora =
    document.getElementById("hora");

    if(fecha){

        fecha.value =
        hoy.toISOString().split("T")[0];

    }

    if(hora){

        hora.value =
        hoy.toTimeString().substring(0,5);

    }

}

/* =========================================================
   CONSECUTIVO
========================================================= */

function generarConsecutivo(){

    const input =
    document.getElementById("numeroInspeccion");

    if(!input) return;

    let numero =
    localStorage.getItem("consecutivoInspeccion");

    if(!numero){

        numero = 1;

    }else{

        numero =
        parseInt(numero)+1;

    }

    localStorage.setItem(
        "consecutivoInspeccion",
        numero
    );

    input.value =
    "INS-" +
    String(numero).padStart(5,"0");

}

/* =========================================================
   PROGRESO
========================================================= */

function configurarProgreso(){

    actualizarProgreso();

    document
    .querySelectorAll(
        "input,select,textarea"
    )
    .forEach(campo=>{

        campo.addEventListener(
            "input",
            actualizarProgreso
        );

        campo.addEventListener(
            "change",
            actualizarProgreso
        );

    });

}

function actualizarProgreso(){

    const campos =
    document.querySelectorAll(
        "input,select,textarea"
    );

    let llenos = 0;

    campos.forEach(campo=>{

        if(
            campo.type==="radio"
        ){

            if(document.querySelector(
                `input[name="${campo.name}"]:checked`
            )){

                llenos++;

            }

        }

        else if(
            campo.type==="checkbox"
        ){

            if(campo.checked)
                llenos++;

        }

        else{

            if(campo.value.trim()!=="")
                llenos++;

        }

    });

    const porcentaje =
    Math.round(
        llenos*100/campos.length
    );

    document.getElementById(
        "progressFill"
    ).style.width =
    porcentaje+"%";

    document.getElementById(
        "progressText"
    ).textContent =
    porcentaje+"%";

}

/* =========================================================
   SCROLL TOP
========================================================= */

function configurarScrollTop(){

    const boton =
    document.getElementById(
        "scrollTop"
    );

    window.addEventListener(
        "scroll",
        ()=>{

            boton.style.display =
            window.scrollY>500
            ?"block"
            :"none";

        });

    boton.onclick=()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    };

}

/* =========================================================
   MENU
========================================================= */

function configurarMenu(){

    const enlaces =
    document.querySelectorAll(
        ".floating-nav a"
    );

    enlaces.forEach(enlace=>{

        enlace.addEventListener(
            "click",
            e=>{

                e.preventDefault();

                const destino =
                document.querySelector(
                    enlace.getAttribute("href")
                );

                destino.scrollIntoView({

                    behavior:"smooth"

                });

            });

    });

}

/* =========================================================
   FOTOS
========================================================= */

let evidencias=[];

function configurarFotos(){

    const input=document.getElementById("photoInput");

    document
    .getElementById("btnCamera")
    .onclick=()=>input.click();

    document
    .getElementById("btnGallery")
    .onclick=()=>input.click();

    input.addEventListener("change",e=>{

        [...e.target.files].forEach(file=>{

            evidencias.push(file);

        });

        renderFotos();

    });

}
function renderFotos(){

    const preview=
    document.getElementById("photoPreview");

    preview.innerHTML="";

    if(evidencias.length===0){

        preview.innerHTML=`

        <div class="photo-placeholder">

            <i class="fa-solid fa-images"></i>

            <span>

                Aún no hay fotografías

            </span>

        </div>

        `;

        return;

    }

    evidencias.forEach((foto,index)=>{

        const card=document.createElement("div");

        card.className="photo-card";

        card.innerHTML=`

        <img src="${URL.createObjectURL(foto)}">

        <div class="photo-toolbar">

            <button
                onclick="subirFoto(${index})">

                <i class="fa-solid fa-arrow-up"></i>

            </button>

            <button
                onclick="bajarFoto(${index})">

                <i class="fa-solid fa-arrow-down"></i>

            </button>

            <button
                onclick="eliminarFoto(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        preview.appendChild(card);

    });

}
function eliminarFoto(i){

    evidencias.splice(i,1);

    renderFotos();

}

function subirFoto(i){

    if(i===0) return;

    [evidencias[i],evidencias[i-1]]=

    [evidencias[i-1],evidencias[i]];

    renderFotos();

}

function bajarFoto(i){

    if(i===evidencias.length-1) return;

    [evidencias[i],evidencias[i+1]]=

    [evidencias[i+1],evidencias[i]];

    renderFotos();

}
/* =========================================================
   FIRMAS
========================================================= */

function configurarFirmas(){

    inicializarFirma("firmaInspector");

    inicializarFirma("firmaRepresentante");

    document
    .querySelectorAll(".clear-signature")
    .forEach(btn=>{

        btn.onclick=()=>{

            limpiarFirma(btn.dataset.canvas);

        };

    });

}

function inicializarFirma(id){

    const canvas=document.getElementById(id);

    const ctx=canvas.getContext("2d");

    ctx.lineWidth=2.5;

    ctx.lineCap="round";

    ctx.strokeStyle="#111";

    let dibujando=false;

    function posicion(e){

        const r=canvas.getBoundingClientRect();

        const t=e.touches?.[0];

        return{

            x:(t?t.clientX:e.clientX)-r.left,

            y:(t?t.clientY:e.clientY)-r.top

        };

    }

    function iniciar(e){

        dibujando=true;

        const p=posicion(e);

        ctx.beginPath();

        ctx.moveTo(p.x,p.y);

    }

    function mover(e){

        if(!dibujando) return;

        e.preventDefault();

        const p=posicion(e);

        ctx.lineTo(p.x,p.y);

        ctx.stroke();

    }

    function terminar(){

        dibujando=false;

    }

    canvas.addEventListener("mousedown",iniciar);

    canvas.addEventListener("mousemove",mover);

    canvas.addEventListener("mouseup",terminar);

    canvas.addEventListener("mouseleave",terminar);

    canvas.addEventListener("touchstart",iniciar);

    canvas.addEventListener("touchmove",mover);

    canvas.addEventListener("touchend",terminar);

}

function limpiarFirma(id){

    const canvas=document.getElementById(id);

    canvas
    .getContext("2d")
    .clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

}
function obtenerFirma(id){

    return document
        .getElementById(id)
        .toDataURL("image/png");

}

/* =========================================================
   AUTOGUARDADO
========================================================= */

function configurarAutoGuardado(){

    const form =
    document.getElementById(
        "inspectionForm"
    );

    form.addEventListener(
        "input",
        ()=>{

            const datos =
            new FormData(form);

            const json={};

            datos.forEach(
                (v,k)=>json[k]=v
            );

            localStorage.setItem(

                "inspectionDraft",

                JSON.stringify(json)

            );

        });

}
