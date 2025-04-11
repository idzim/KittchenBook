// frontend/js/ui/mealplannerUI.js

/**
 * Renderuje widok planów posiłków.
 * @param {Array} mealPlans - Tablica planów posiłków, np. [{ id, date, mealPlanRecipes: [...] }, ...]
 * @param {Array} recipes - Dostępne przepisy, np. [{ name: "Naleśniki", link: "..." }, ...]
 * @param {string} containerId - Id elementu, w którym renderujemy widok (np. "day-list")
 * @param {function} addRecipeCallback - Callback wywoływany przy wyborze nowego przepisu
 */
export function renderMealPlan(mealPlans, recipes, containerId, addRecipeCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
  
    mealPlans.forEach((plan, index) => {
      // Generujemy opcje wyboru przepisu
      const mealOptions = recipes
        .map(recipe => `<option value='${JSON.stringify(recipe)}'>${recipe.name}</option>`)
        .join('');
  
      // Renderujemy pojedynczy plan
      const planTile = document.createElement("div");
      planTile.classList.add("mealplan-tile");
      planTile.innerHTML = `
        <h3>${plan.date}</h3>
        <div class="meals">
          ${plan.mealPlanRecipes && plan.mealPlanRecipes.length > 0
            ? plan.mealPlanRecipes
                .map(recipe => `
                  <div class="meal-tile">
                    <div class="meal-name">${recipe.name}</div>
                    <a href="${recipe.link}" target="_blank" class="meal-recipe">Zobacz przepis</a>
                  </div>
                `)
                .join('')
            : `<p>Brak dodanych przepisów</p>`}
        </div>
        <div class="add-recipe">
          <select data-plan-index="${index}">
            <option value="">+ Dodaj Przepis</option>
            ${mealOptions}
          </select>
        </div>
      `;
  
      // Podpinamy zdarzenie na zmianę w select
      const selectElement = planTile.querySelector("select");
      selectElement.addEventListener("change", (event) => {
        addRecipeCallback(index, event.target);
      });
  
      container.appendChild(planTile);
    });
  }
  