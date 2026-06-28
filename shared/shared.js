function iniciarLayout() {

    const btn = document.getElementById("menuButton");

    const sidebar = document.getElementById("sidebar");

    if (btn && sidebar) {

        btn.onclick = () => {

            sidebar.classList.toggle("show");

        };

    }

    actualizarHora();

    setInterval(actualizarHora, 1000);

}

function actualizarHora() {

    const reloj = document.getElementById("clock");

    if (!reloj) return;

    const ahora = new Date();

    reloj.innerHTML = ahora.toLocaleString("es-CO", {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"

    });

}
