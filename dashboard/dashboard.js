async function loadComponent(containerId, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(file);
        }

        const html = await response.text();

        document.getElementById(containerId).innerHTML = html;

    } catch (e) {

        console.error("No se pudo cargar:", file);

    }
}

async function initDashboard() {

    await loadComponent(
        "sidebar-container",
        "../shared/components/sidebar.html"
    );

    await loadComponent(
        "header-container",
        "../shared/components/header.html"
    );

    iniciarLayout();

}

document.addEventListener("DOMContentLoaded", initDashboard);
