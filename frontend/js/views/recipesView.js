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
      // Resetowanie pola filtra nazwy
      document.getElementById("filter-name").value = "";
      // Jeśli będą inne pola, resetuj je tutaj
      // Odświeżenie listy pełnych przepisów
      renderRecipeList();
    });
  }
}
