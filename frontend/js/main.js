// js/main.js
import { renderLayout } from "./ui/layout.js";

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();

  const path = window.location.pathname;

  // dynamiczny import – kod pobierany tylko gdy rzeczywiście jesteśmy na stronie przepisów
  if (path.startsWith("/recipes") || path.endsWith("recipes.html")) {
    import("./views/recipesView.js").then(({ initRecipesView }) => initRecipesView());
  }

  if (path.startsWith("/mealplanner")) {
    import("./views/mealPlannerView.js").then(({ initMealPlannerView }) => initMealPlannerView());
  }

});
