/*==========================================================
 APP BOMBEROS
 SIDEBAR COMPONENT
==========================================================*/

function renderSidebar(active = "") {

    const container = document.getElementById("sidebar");

    if (!container) return;

    container.className = "sidebar";

    container.innerHTML = `

        <div class="sidebar-header">

            <div class="sidebar-logo">
                <i class="fa-solid fa-fire"></i>
            </div>

            <div>

                <div class="sidebar-title">
                    APP BOMBEROS
                </div>

                <div class="sidebar-subtitle">
                    Sistema Integral de Gestión
                </div>

            </div>

        </div>

        <nav>

            <a
                href="index.html"
                class="${active === "dashboard" ? "active" : ""}">

                <i class="fa-solid fa-house"></i>

                <span>Dashboard</span>

            </a>

            <a
                href="modules/emergencia/index.html"
                class="${active === "emergencia" ? "active" : ""}">

                <i class="fa-solid fa-fire-extinguisher"></i>

                <span>Emergencias</span>

            </a>

            <a
                href="#"
                onclick="abrirAPH()">

                <i class="fa-solid fa-truck-medical"></i>

                <span>APH</span>

            </a>

            <a
                href="#"
                onclick="abrirAyudas()">

                <i class="fa-solid fa-box-open"></i>

                <span>Ayudas Humanitarias</span>

            </a>

            <a
                href="#"
                onclick="abrirInspecciones()">

                <i class="fa-solid fa-building-shield"></i>

                <span>Inspecciones</span>

            </a>

            <a
                href="#"
                onclick="abrirEstadisticas()">

                <i class="fa-solid fa-chart-column"></i>

                <span>Reportes y Estadísticas</span>

            </a>

        </nav>

        <div style="margin-top:auto;padding:20px;font-size:13px;opacity:.7;text-align:center;">

            <hr style="margin-bottom:15px;border:none;border-top:1px solid rgba(255,255,255,.2);">

            <div>

                <strong>Versión 2.0</strong>

            </div>

            <div>

                Sistema Integral de Bomberos

            </div>

        </div>

    `;

}
