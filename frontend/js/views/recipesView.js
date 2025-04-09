// js/views/recipesView.js
import { renderRecipeList, handleCreateRecipe, applyFilters } from "../ui/recipesUI.js";

export async function initRecipesView() {
  // Renderowanie listy przepisów
  await renderRecipeList();

  // Inicjacja obsługi formularza dodawania przepisu
  handleCreateRecipe();

  // Obsługa przycisku "Szukaj"
  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      applyFilters();
    });
  }

  // Obsługa klawisza Enter w polu filtra nazwy
  const filterInput = document.getElementById("filter-name");
  if (filterInput) {
    filterInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFilters();
      }
    });
  }

  // Obsługa przycisku czyszczącego filtry
  const clearButton = document.getElementById("clear-filters");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      document.getElementById("filter-name").value = "";

      // Resetuj dodatkowe filtry jeśli dodane
      const filterTags = document.getElementById("filter-tags");
      if (filterTags) filterTags.selectedIndex = 0;

      // Można dodać więcej czyszczeń w przyszłości

      renderRecipeList();
    });
  }

  // Obsługa pokazywania/ukrywania dodatkowych filtrów
  const toggleFiltersLink = document.getElementById("toggle-advanced-filters");
  const advancedFilters = document.getElementById("advanced-filters");

  if (toggleFiltersLink && advancedFilters) {
    toggleFiltersLink.addEventListener("click", (e) => {
      e.preventDefault();
      advancedFilters.classList.toggle("d-none");

      toggleFiltersLink.textContent = advancedFilters.classList.contains("d-none")
        ? "Więcej filtrów"
        : "Ukryj dodatkowe filtry";
    });
  }
}
