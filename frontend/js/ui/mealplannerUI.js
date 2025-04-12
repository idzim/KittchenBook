// frontend/js/ui/mealplannerUI.js

import * as mealplanAPI from "../api/mealplanAPI.js";
import { fetchRecipes } from "../api/recipesAPI.js";

/**
 * Tworzy szablon karty planu posiłków.
 * @param {Object} plan - Obiekt planu, np. { id, date, mealPlanRecipes: [...] }.
 * @param {Array} recipes - Tablica dostępnych przepisów.
 * @param {number} planIndex - Indeks planu (używany przy podpinaniu zdarzeń).
 * @returns {string} HTML reprezentujący kartę planu.
 */

function getDzienTygodnia(dataString) {
  const dniTygodnia = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const data = new Date(dataString);
  return dniTygodnia[data.getDay()];
}

export function createMealPlanCard(plan, recipes, planIndex) {
  const mealOptions = recipes
    .map(recipe => `<option value='${JSON.stringify(recipe)}'>${recipe.name}</option>`)
    .join("");

  return `
    <li class="mealplan-card mb-3">
      <article class="card">
        <header class="card-header d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0">${getDzienTygodnia(plan.date)}, ${plan.date}</h3>
          <div class="dropdown">
            <!-- Przycisk z ikoną trzech kropek -->
            <button class="btn btn-sm btn-secondary dropdown-toggle btn-three-dots" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <button class="dropdown-item" onclick="editMealPlan(${plan.id})">
                  Edytuj plan
                </button>
              </li>
              <li>
                <button class="dropdown-item text-danger" onclick="deleteMealPlanById(${plan.id})">
                  Usuń plan
                </button>
              </li>
            </ul>
          </div>
        </header>
        <section class="card-body">
          ${
            plan.mealPlanRecipes && plan.mealPlanRecipes.length > 0
              ? plan.mealPlanRecipes
                  .map(recipe => `
                    <div class="meal-tile">
                      <p class="meal-name">${recipe.name}</p>
                      <a href="${recipe.link}" target="_blank" class="meal-recipe">Zobacz przepis</a>
                    </div>
                  `)
                  .join("")
              : `<p>Brak dodanych przepisów</p>`
          }
        </section>
        <footer class="card-footer">
          <label for="select-plan-${planIndex}" class="visually-hidden">Dodaj przepis</label>
          <select id="select-plan-${planIndex}" data-plan-index="${planIndex}">
            <option value="">+ Dodaj przepis</option>
            ${mealOptions}
          </select>
        </footer>
      </article>
    </li>
  `;
}

/**
 * Renderuje widok planów posiłków.
 * @param {Array} mealPlans - Tablica planów (np. [{ id, date, mealPlanRecipes: [...] }, ...]).
 * @param {Array} recipes - Tablica dostępnych przepisów.
 * @param {string} containerId - ID elementu, w którym ma być wyświetlona lista (u Ciebie: "day-list").
 * @param {function} addRecipeCallback - Callback wywoływany przy zmianie elementu <select> (dodanie przepisu).
 */
export function renderMealPlan(mealPlans, recipes, containerId, addRecipeCallback) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (mealPlans.length === 0) {
    container.innerHTML = "<p>Brak planów posiłków do wyświetlenia.</p>";
    return;
  }

  // Używamy semantycznego elementu <ul> jako listy planów
  const ulElement = document.createElement("ul");
  ulElement.classList.add("list-unstyled");

  mealPlans.forEach((plan, index) => {
    ulElement.innerHTML += createMealPlanCard(plan, recipes, index);
  });
  container.appendChild(ulElement);

  // Podpięcie zdarzeń dla wszystkich selectów
  ulElement.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", event => {
      const idx = parseInt(select.getAttribute("data-plan-index"));
      addRecipeCallback(idx, event.target);
    });
  });
}

/**
 * Inicjalizuje widok planera posiłków.
 * Pobiera dane z API (przepisy i plany) oraz renderuje widok.
 * @param {function} addRecipeCallback - Callback do obsługi dodania przepisu.
 * @returns {Promise<{ mealPlans: Array, recipes: Array }>} Dane pobrane z API.
 */
export async function initMealPlannerUI(addRecipeCallback) {
  try {
    // Pobierz dane z API
    const recipes = await fetchRecipes();
    const mealPlans = await mealplanAPI.fetchMealPlans();
    
    // Renderuj widok w kontenerze "day-list"
    renderMealPlan(mealPlans, recipes, "day-list", addRecipeCallback);
    
    // Zwracamy pobrane dane, jeśli potrzebne w warstwie view.
    return { mealPlans, recipes };
  } catch (error) {
    console.error("Błąd inicjalizacji UI:", error);
    alert("Błąd inicjalizacji planera posiłków.");
  }
}

/**
 * Aktualizuje widok planów posiłków – może być wywoływana po wprowadzeniu zmian.
 * @param {function} addRecipeCallback - Callback do obsługi dodania przepisu.
 */
export async function updateMealPlanUI(addRecipeCallback) {
  await initMealPlannerUI(addRecipeCallback);
}
