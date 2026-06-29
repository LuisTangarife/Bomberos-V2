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
                type="button"
                onclick="subirFoto(${index})">

                <i class="fa-solid fa-arrow-up"></i>

            </button>

            <button
                type="button"
                onclick="bajarFoto(${index})">

                <i class="fa-solid fa-arrow-down"></i>

            </button>

            <button
                type="button"
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

    const canvas =
    document.getElementById(id);

    const ctx =
    canvas.getContext("2d");

    ajustarCanvas(canvas,ctx);

    let dibujando=false;

    function obtenerPosicion(event){

        const rect =
        canvas.getBoundingClientRect();

        const escalaX =
        canvas.width / rect.width;

        const escalaY =
        canvas.height / rect.height;

        let clienteX;
        let clienteY;

        if(event.touches){

            clienteX =
            event.touches[0].clientX;

            clienteY =
            event.touches[0].clientY;

        }else{

            clienteX =
            event.clientX;

            clienteY =
            event.clientY;

        }

        return{

            x:(clienteX-rect.left)*escalaX,

            y:(clienteY-rect.top)*escalaY

        };

    }

    function iniciar(event){

        dibujando=true;

        const p=
        obtenerPosicion(event);

        ctx.beginPath();

        ctx.moveTo(p.x,p.y);

       const estado =
       canvas.parentElement.querySelector(
       ".signature-status"
       );
      
       if(estado){
      
           estado.textContent="Firma registrada";
      
           estado.style.color="#16a34a";
      
       }

    }

    function mover(event){

        if(!dibujando) return;

        event.preventDefault();

        const p=
        obtenerPosicion(event);

        ctx.lineTo(p.x,p.y);

        ctx.stroke();

    }

    function terminar(){

        dibujando=false;

    }

    canvas.addEventListener(
        "mousedown",
        iniciar
    );

    canvas.addEventListener(
        "mousemove",
        mover
    );

    canvas.addEventListener(
        "mouseup",
        terminar
    );

    canvas.addEventListener(
        "mouseleave",
        terminar
    );

    canvas.addEventListener(
        "touchstart",
        iniciar,
        {passive:false}
    );

    canvas.addEventListener(
        "touchmove",
        mover,
        {passive:false}
    );

    canvas.addEventListener(
        "touchend",
        terminar
    );

    window.addEventListener(
        "resize",
        ()=>ajustarCanvas(canvas,ctx)
    );

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
function ajustarCanvas(canvas,ctx){

    const ratio =
    window.devicePixelRatio || 1;

    const ancho =
    canvas.offsetWidth;

    const alto =
    canvas.offsetHeight;

    const imagen =
    canvas.toDataURL();

    canvas.width =
    ancho * ratio;

    canvas.height =
    alto * ratio;

    ctx.scale(ratio,ratio);

    ctx.lineWidth=2.5;

    ctx.lineCap="round";

    ctx.lineJoin="round";

    ctx.strokeStyle="#111827";

    if(imagen.length>6){

        const img =
        new Image();

        img.onload=()=>{

            ctx.drawImage(
                img,
                0,
                0,
                ancho,
                alto
            );

        };

        img.src=imagen;

    }

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
