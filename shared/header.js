/*==========================================================
 APP BOMBEROS
 HEADER COMPONENT
==========================================================*/

function renderHeader(title = "Dashboard") {

    const container = document.getElementById("header");

    if (!container) return;

    container.innerHTML = `

        <header class="main-header">

            <div class="header-left">

                <button
                    class="menu-btn"
                    onclick="toggleSidebar()">

                    <i class="fa-solid fa-bars"></i>

                </button>

                <div>

                    <h2 style="margin:0;font-size:22px;">

                        ${title}

                    </h2>

                    <small style="color:#777;">

                        Sistema Integral de Gestión

                    </small>

                </div>

            </div>

            <div class="header-right">

                <div id="clock"></div>

                <div
                    style="
                    width:42px;
                    height:42px;
                    background:#C62828;
                    color:#FFF;
                    border-radius:50%;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    font-weight:bold;
                    ">

                    <i class="fa-solid fa-user"></i>

                </div>

            </div>

        </header>

    `;

    actualizarHora();

}
