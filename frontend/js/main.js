// js/main.js
import { renderLayout } from "./ui/layout.js";
import { initRecipesView } from "./views/recipesView.js";

document.addEventListener("DOMContentLoaded", () => {
  // Renderowanie globalnego layoutu (navbar, footer)
  renderLayout();

  // Wykrywanie, która strona jest wyświetlana – przykładowo na podstawie URL
  const path = window.location.pathname;

  if (path.includes("recipes.html")) {
    // Ładujemy widok przepisów
    initRecipesView();
  }
  // Możesz tutaj dodać kolejne warunki dla innych widoków, np. mealplanner.html, about.html itp.
});
