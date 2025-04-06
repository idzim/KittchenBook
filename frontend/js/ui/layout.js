export function renderLayout(pageTitle = "") {
    const header = document.createElement("header");
    header.innerHTML = `
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <img src="../assets/logo.png" alt="KittchenBook Logo" width="30" height="30" class="d-inline-block align-text-top me-2">
                    ${pageTitle || "KittchenBook"}
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#kittchenNavbar" aria-controls="kittchenNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="kittchenNavbar">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="nav-link" href="../../index.html">Strona Główna</a></li>
                        <li class="nav-item"><a class="nav-link" href="../../pages/recipes.html">Przepisy</a></li>
                        <li class="nav-item"><a class="nav-link" href="../../pages/mealplanner.html">Planer Posiłków</a></li>
                        <li class="nav-item"><a class="nav-link" href="../../pages/about.html">O nas</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;

    const footer = document.createElement("footer");
    footer.classList.add("text-center", "mt-4", "py-3", "bg-light");
    footer.innerHTML = `
        <p class="mb-0">&copy; 2024 KittchenBook. Wszelkie prawa zastrzeżone.</p>
    `;

    document.body.prepend(header);
    document.body.appendChild(footer);

    highlightActiveNav();
}
