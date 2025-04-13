import * as mealplanAPI from "../api/mealplanAPI.js";
import { fetchRecipes } from "../api/recipesAPI.js";

/**
 * Zwraca nazwę dnia tygodnia dla podanej daty.
 */
function getDzienTygodnia(dataString) {
  const dniTygodnia = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const data = new Date(dataString);
  return dniTygodnia[data.getDay()];
}

/**
 * Tworzy szablon karty planu posiłków.
 * Zamiast selecta wyświetlamy przycisk otwierający modal.
 */
export function createMealPlanCard(plan, recipes, planIndex) {
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
        <footer class="card-footer text-center">
          <!-- Przycisk z plusem, otwierający modal -->
          <button 
            class="btn-add-recipe" 
            data-plan-id="${plan.id}" 
            data-plan-index="${planIndex}"
            type="button" 
            data-bs-toggle="modal" 
            data-bs-target="#addRecipeModal"
            title="Dodaj przepis">
              +
          </button>
        </footer>
      </article>
    </li>
  `;
}

/**
 * Renderuje widok planów posiłków.
 */
export function renderMealPlan(mealPlans, recipes, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (mealPlans.length === 0) {
    container.innerHTML = "<p>Brak planów posiłków do wyświetlenia.</p>";
    return;
  }

  // Używamy elementu <ul> jako listy planów
  const ulElement = document.createElement("ul");
  ulElement.classList.add("list-unstyled");

  mealPlans.forEach((plan, index) => {
    ulElement.innerHTML += createMealPlanCard(plan, recipes, index);
  });
  container.appendChild(ulElement);

  // Usunięto podpinanie zdarzeń dla <select>, ponieważ teraz korzystamy z przycisków
}

/**
 * Inicjalizuje widok planera posiłków:
 * - pobiera dane (przepisy i plany),
 * - renderuje widok,
 * - przypina obsługę modala.
 */
export async function initMealPlannerUI() {
  try {
    // Pobierz dane
    const recipes = await fetchRecipes();
    const mealPlans = await mealplanAPI.fetchMealPlans();
    
    // Renderuj widok w "day-list"
    renderMealPlan(mealPlans, recipes, "day-list");
    
    // Przypinamy obsługę przycisków otwierających modal oraz wypełnianie listy przepisów
    bindModalHandlers(recipes, mealPlans);
    
    return { mealPlans, recipes };
  } catch (error) {
    console.error("Błąd inicjalizacji UI:", error);
    alert("Błąd inicjalizacji planera posiłków.");
  }
}

/**
 * Przypina eventy dla przycisków otwierających modal oraz obsługuje formularz modala.
 * @param {Array} recipes - Lista dostępnych przepisów.
 * @param {Array} mealPlans - Lista planów, potrzebna do ustalenia, do którego planu dodajemy przepis.
 */
function bindModalHandlers(recipes, mealPlans) {
  // Event dla przycisków "+"
  document.querySelectorAll(".btn-add-recipe").forEach(btn => {
    btn.addEventListener("click", () => {
      // Ustawia aktualny plan, z którego wywołaliśmy modal
      const currentPlanId = btn.getAttribute("data-plan-id");
      btn.setAttribute("data-current-plan-id", currentPlanId); // ewentualne dodatkowe przechowanie
      populateRecipesDropdown(recipes);
      // Opcjonalnie: możesz ustawić też jakieś dane pomocnicze w modalu, np. hidden input z id planu.
    });
  });

  // Obsługa formularza w modalu
  const form = document.getElementById("add-recipe-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const recipeSelect = document.getElementById("recipe-select");
    const mealtypeSelect = document.getElementById("mealtype-select");
    
    const selectedRecipeValue = recipeSelect.value;
    const selectedMealType = mealtypeSelect.value;
    
    if (!selectedRecipeValue || !selectedMealType) {
      alert("Wybierz przepis i typ posiłku!");
      return;
    }
    
    const selectedRecipe = JSON.parse(selectedRecipeValue);
    
    // Pobieramy ID planu – zakładamy, że jest ustawione jako atrybut w przycisku
    const currentPlanId = document.querySelector(".btn-add-recipe[data-bs-target='#addRecipeModal']").getAttribute("data-plan-id");
    const planIndex = mealPlans.findIndex(plan => plan.id == currentPlanId);
    if (planIndex === -1) {
      alert("Nie znaleziono wybranego planu!");
      return;
    }
    
    // Dodajemy nowy przepis do lokalnego modelu
    mealPlans[planIndex].mealPlanRecipes = mealPlans[planIndex].mealPlanRecipes || [];
    mealPlans[planIndex].mealPlanRecipes.push({ ...selectedRecipe, mealType: selectedMealType });
    
    // Aktualizujemy plan przy użyciu API
    try {
      const updatedPlan = await mealplanAPI.updateMealPlan(currentPlanId, mealPlans[planIndex]);
      mealPlans[planIndex] = updatedPlan;
      // Odświeżenie widoku (całkowite ponowne pobranie i rendering)
      await initMealPlannerUI();
    } catch (error) {
      console.error("Błąd przy aktualizacji planu:", error);
      alert("Nie udało się zaktualizować planu.");
    }
    
    // Reset formularza
    form.reset();
    
    // Zamknięcie modala (Bootstrap)
    const modalEl = document.getElementById("addRecipeModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
  });
}

/**
 * Wypełnia dropdown w modalu listą przepisów.
 * @param {Array} recipes - Lista dostępnych przepisów.
 */
function populateRecipesDropdown(recipes) {
  const recipeSelect = document.getElementById("recipe-select");
  recipeSelect.innerHTML = "<option value=''>-- Wybierz przepis --</option>";
  recipes.forEach(recipe => {
    recipeSelect.innerHTML += `<option value='${JSON.stringify(recipe)}'>${recipe.name}</option>`;
  });
}

/**
 * Aktualizuje widok planów posiłków.
 */
export async function updateMealPlanUI() {
  await initMealPlannerUI();
}
