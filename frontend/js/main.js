import { renderLayout } from "./ui/layout.js";  // Importowanie z folderu 'ui'
import { renderRecipeList, handleCreateRecipe } from "./ui/recipesUI.js";  // Importowanie funkcji renderujących

document.addEventListener("DOMContentLoaded", () => {
    // Renderowanie layoutu na samym początku
    renderLayout();

    // Renderowanie listy przepisów
    try {
        renderRecipeList();
    } catch (error) {
        console.error("Błąd przy renderowaniu listy przepisów:", error);
        alert("Wystąpił błąd podczas ładowania przepisów.");
    }

    // Obsługa przycisku do pokazania formularza
    const showFormButton = document.getElementById("show-form");
    const recipeForm = document.getElementById("recipe-form");

    showFormButton.addEventListener("click", () => {
        recipeForm.style.display = recipeForm.style.display === "none" ? "block" : "none";
    });

    // Inicjalizacja formularza dodawania przepisu
    try {
        handleCreateRecipe();
    } catch (error) {
        console.error("Błąd przy obsłudze formularza:", error);
        alert("Wystąpił błąd przy obsłudze formularza.");
    }

    // Możesz dodać inne funkcje po tym, jak layout jest już gotowy
});
