// js/views/recipesView.js
import { renderRecipeList, handleCreateRecipe } from "../ui/recipesUI.js";
import { seedSampleRecipes } from "../api/recipesAPI.js";


export async function initRecipesView() {
  // Renderujemy listę przepisów
  await renderRecipeList();
  // Inicjujemy obsługę formularza dodawania przepisu
  handleCreateRecipe();
}
// …wewnątrz initRecipesView():
document.getElementById("seed-btn")?.addEventListener("click", async () => {
  try {
    await seedSampleRecipes();   // dodaj do bazy
    await renderRecipeList();    // odśwież listę kart
    alert("Przykładowe przepisy dodane!");
  } catch (e) {
    alert("Nie udało się wgrać przykładowych przepisów");
    console.error(e);
  }
});