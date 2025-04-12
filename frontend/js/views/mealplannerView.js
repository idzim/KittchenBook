// frontend/js/views/mealplannerView.js

import { initMealPlannerUI, updateMealPlanUI } from "../ui/mealplannerUI.js";

// Lokalna kopia danych (jeśli potrzebujemy ich późniejszej edycji lokalnie)
let localMealPlans = [];

/**
 * Callback obsługujący dodanie przepisu do planu.
 * Ta funkcja jest przekazywana do modułu UI i wywoływana przy zmianie elementu <select>.
 * @param {number} planIndex - Indeks planu, do którego dodajemy przepis.
 * @param {HTMLSelectElement} selectElement - Element <select> z wybranym przepisem.
 */
async function addRecipe(planIndex, selectElement) {
  if (selectElement.value) {
    const selectedRecipe = JSON.parse(selectElement.value);
    localMealPlans[planIndex].mealPlanRecipes = localMealPlans[planIndex].mealPlanRecipes || [];
    localMealPlans[planIndex].mealPlanRecipes.push(selectedRecipe);
    try {
      // Aktualizujemy widok poprzez ponowne pobranie danych z API i renderowanie widoku
      await updateMealPlanUI(addRecipe);
    } catch (error) {
      alert("Nie udało się zaktualizować planu.");
    }
  }
}

/**
 * Inicjalizuje widok planera posiłków.
 * Warstwa view wywołuje funkcję UI, która pobiera dane i renderuje widok.
 * Dodatkowo podpinamy zdarzenia dla przycisków akcji (np. zapisu, resetu).
 */
export async function initMealPlanner() {
  try {
    // Inicjujemy UI, przekazując callback obsługujący dodanie przepisu
    const data = await initMealPlannerUI(addRecipe);
    localMealPlans = data.mealPlans;

    // Podpięcie zdarzeń dla przycisków akcji – upewnij się, że elementy o id "btn-save" i "btn-reset" istnieją w HTML.
    document.getElementById("btn-save").addEventListener("click", async () => {
      alert("Akcja zapisu – implementację zapisu planów przez API należy umieścić w warstwie UI.");
      // Możesz wywołać updateMealPlanUI(addRecipe) lub dodatkową logikę zapisu.
    });
    document.getElementById("btn-reset").addEventListener("click", async () => {
      alert("Akcja resetu – implementację resetu planów należy umieścić w warstwie UI.");
      // Dodaj logikę resetu i ponownego odświeżenia widoku, jeśli to konieczne.
    });
  } catch (error) {
    console.error("Błąd inicjalizacji planera:", error);
    alert("Błąd inicjalizacji planera posiłków.");
  }
}
