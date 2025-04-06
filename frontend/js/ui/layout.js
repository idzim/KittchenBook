export function renderLayout(pageTitle = "") {
    const header = document.createElement("header");
    header.classList.add("custom-header"); // Dodajemy klasę do stylowania

    header.innerHTML = `
        <nav class="navbar ">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center text-white" href="#">
                    <img src="../assets/logo.png" alt="KittchenBook Logo" width="30" height="30" class="me-2">
                    ${pageTitle || "KittchenBook"}
                </a>
                <button class="navbar-toggler text-white border-white" type="button" data-bs-toggle="collapse" data-bs-target="#kittchenNavbar" aria-controls="kittchenNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="kittchenNavbar">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="nav-link text-white" href="../../index.html">Strona Główna</a></li>
                        <li class="nav-item"><a class="nav-link text-white" href="../../pages/recipes.html">Przepisy</a></li>
                        <li class="nav-item"><a class="nav-link text-white" href="../../pages/mealplanner.html">Planer Posiłków</a></li>
                        <li class="nav-item"><a class="nav-link text-white" href="../../pages/about.html">O nas</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;

    const footer = document.createElement("footer");
    footer.classList.add("custom-footer", "text-center", "mt-4", "py-3");
    footer.innerHTML = `
        <p class="mb-0">&copy; 2024 KittchenBook. Wszelkie prawa zastrzeżone.</p>
    `;

    document.body.prepend(header);
    document.body.appendChild(footer);

    highlightActiveNav();
}
