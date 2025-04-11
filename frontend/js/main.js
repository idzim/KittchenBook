// js/main.js
import { renderLayout } from "./ui/layout.js";
import { initRecipesView } from "./views/recipesView.js";
import { initMealPlanner } from "./views/mealplannerView.js";

document.addEventListener("DOMContentLoaded", () => {
  // Renderowanie globalnego layoutu (navbar, footer)
  renderLayout();

  // Wykrywanie, która strona jest wyświetlana – przykładowo na podstawie URL
  const path = window.location.pathname;

  if (path.includes("recipes.html")) {
    // Ładujemy widok przepisów
    initRecipesView();
  } else if (path.includes("mealplanner.html")) {
    // Ładujemy widok planera posiłków
    initMealPlanner();
  }
  // Możesz tutaj dodać kolejne warunki dla innych widoków, np. about.html itp.
});
