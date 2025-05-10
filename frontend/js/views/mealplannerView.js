// frontend/js/views/mealplannerView.js

import { initMealPlannerUI, renderMealPlan } from "../ui/mealplannerUI.js";
import { addMealPlanRecipe } from "../api/mealplanRecipeAPI.js";

// Globalna lokalna kopia danych
let localMealPlans = [];
let localRecipes = [];

/**
 * Callback obsługujący dodanie przepisu do planu.
 * @param {number} planIndex
 * @param {HTMLSelectElement} selectElement
 */
async function addRecipe(planIndex, selectElement) {
  if (selectElement.value) {
    try {
      const selectedRecipe = JSON.parse(selectElement.value);
      const mealType = document.getElementById("mealtype-select").value;
      if (!mealType) {
        alert("Wybierz typ posiłku!");
        return;
      }

      if (!localMealPlans[planIndex].mealPlanRecipes) {
        localMealPlans[planIndex].mealPlanRecipes = [];
      }

      localMealPlans[planIndex].mealPlanRecipes.push({
        recipe: selectedRecipe,
        mealType: mealType,
        isNew: true // oznaczenie lokalnych zmian do późniejszego zapisu
      });

      console.log("Dodaję przepis do planu o indeksie:", planIndex, selectedRecipe, mealType);

      renderMealPlan(localMealPlans, localRecipes, "day-list");
    } catch (error) {
      console.error("Błąd w addRecipe:", error);
      alert("Nie udało się dodać przepisu lokalnie.");
    }
  } else {
    alert("Wybierz przepis, aby go dodać.");
  }
}

/**
 * Inicjalizuje widok planera posiłków.
 */
export async function initMealPlanner() {
  try {
    const data = await initMealPlannerUI(addRecipe);
    localMealPlans = data.mealPlans;
    localRecipes = data.recipes;

    console.log("Inicjalizacja planera, lokalne dane:", localMealPlans);

    const saveButton = document.getElementById("btn-save");
    if (saveButton) {
      saveButton.addEventListener("click", async () => {
        try {
          for (const plan of localMealPlans) {
            if (plan.mealPlanRecipes && plan.mealPlanRecipes.length > 0) {
              const newRecipes = plan.mealPlanRecipes.filter(r => r.isNew);
              for (const recipeEntry of newRecipes) {
                await addMealPlanRecipe({
                  recipeId: recipeEntry.recipe.id,
                  mealPlanId: plan.id,
                  mealType: recipeEntry.mealType
                });
                // Oznacz jako zapisane
                recipeEntry.isNew = false;
              }
            }
          }

          alert("Zmiany zostały zapisane.");
        } catch (error) {
          console.error("Błąd podczas zapisywania zmian:", error);
          alert("Nie udało się zapisać zmian.");
        }
      });
    } else {
      console.warn('Element z id "btn-save" nie został znaleziony.');
    }

    const resetButton = document.getElementById("btn-reset");
    if (resetButton) {
      resetButton.addEventListener("click", async () => {
        try {
          await initMealPlanner(); // Reset = ponowne pobranie z backendu
          alert("Widok został zresetowany.");
        } catch (error) {
          console.error("Błąd podczas resetu:", error);
          alert("Nie udało się zresetować widoku.");
        }
      });
    } else {
      console.warn('Element z id "btn-reset" nie został znaleziony.');
    }
  } catch (error) {
    console.error("Błąd inicjalizacji planera:", error);
    alert("Błąd inicjalizacji planera posiłków.");
  }
}
