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

function configurarFotos(){

    const input =
    document.getElementById(
        "photoInput"
    );

    const preview =
    document.getElementById(
        "photoPreview"
    );

    document
    .getElementById("btnCamera")
    .onclick=()=>input.click();

    document
    .getElementById("btnGallery")
    .onclick=()=>input.click();

    input.addEventListener(
        "change",
        ()=>{

            preview.innerHTML="";

            [...input.files]
            .forEach(file=>{

                const img =
                document.createElement("img");

                img.src =
                URL.createObjectURL(file);

                preview.appendChild(img);

            });

        });

}

/* =========================================================
   FIRMAS
========================================================= */

function configurarFirmas(){

    document
    .querySelectorAll(
        ".clear-signature"
    )
    .forEach(btn=>{

        btn.onclick=()=>{

            const canvas =
            document.getElementById(
                btn.dataset.canvas
            );

            const ctx =
            canvas.getContext("2d");

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

        };

    });

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
