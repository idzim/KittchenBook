    // /frontend/js/api/mealplanRecipeAPI.js
    const API_URL = '/api/mealplan-recipes';

    /**
     * Przenosi przypisany przepis (MealPlanRecipe) do nowego planu.
     * @param {number} mealPlanRecipeId - ID przypisanego przepisu (MealPlanRecipe)
     * @param {number} newMealPlanId - ID nowego planu, do którego przepis ma być przeniesiony
     * @returns {Object} Zaktualizowany obiekt przypisanego przepisu
     */
    export async function moveMealPlanRecipe(mealPlanRecipeId, newMealPlanId) {
    try {
        const response = await fetch(`${API_URL}/${mealPlanRecipeId}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newMealPlan: newMealPlanId })
        });
        if (!response.ok) {
        throw new Error('Błąd przy przenoszeniu przypisanego przepisu');
        }
        return await response.json();
    } catch (error) {
        console.error("Błąd API (moveMealPlanRecipe):", error);
        throw error;
    }
    }

    /**
 * Dodaje nowy przepis do planu posiłków.
 * @param {Object} data - Obiekt z recipeId, mealPlanId, mealType
 */
export async function addMealPlanRecipe(data) {
    try {
      const response = await fetch('/api/mealplan-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Błąd przy dodawaniu przypisanego przepisu");
      }
      return await response.json();
    } catch (error) {
      console.error("Błąd API (addMealPlanRecipe):", error);
      throw error;
    }
  }
  
