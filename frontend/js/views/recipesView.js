// js/views/recipesView.js
import { renderRecipeList, handleCreateRecipe } from "../ui/recipesUI.js";

export async function initRecipesView() {
  // Renderujemy listę przepisów
  await renderRecipeList();
  // Inicjujemy obsługę formularza dodawania przepisu
  handleCreateRecipe();
}
