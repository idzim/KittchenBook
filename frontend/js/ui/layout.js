export function renderLayout(pageTitle = "") {
    // Tworzymy header
    const header = document.createElement("header");
    header.innerHTML = `
        <div class="logo">
            <img src="../assets/logo.png" alt="KittchenBook Logo">
            <h1>${pageTitle || "KittchenBook"}</h1>
        </div>
    `;

    // Tworzymy nawigację
    const nav = document.createElement("nav");
    nav.innerHTML = `
        <ul>
            <li><a href="../../index.html">Strona Główna</a></li>
            <li><a href="../../pages/recipes.html">Przepisy</a></li>
            <li><a href="../../pages/mealplanner.html">Planer Posiłków</a></li>
            <li><a href="../../pages/about.html">O nas</a></li>
        </ul>
    `;

    // Tworzymy footer
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <p>&copy; 2024 KittchenBook. Wszelkie prawa zastrzeżone.</p>
    `;

    // Dodajemy elementy do strony
    document.body.prepend(header, nav);
    document.body.appendChild(footer);

    // Aktywujemy odpowiedni link
    highlightActiveNav();
}

// Podkreślenie aktywnego linku w nawigacji
function highlightActiveNav() {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
        if (window.location.pathname.includes(link.getAttribute("href").replace("../", ""))) {
            link.classList.add("active");
        }
    });
}
