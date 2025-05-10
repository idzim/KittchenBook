// /frontend/js/ui/mealplannerUI.js
import * as mealplanAPI from "../api/mealplanAPI.js";
import * as mealPlanRecipeAPI from "../api/mealplanRecipeAPI.js";
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
 * Dla każdego przypisanego przepisu dodajemy atrybuty umożliwiające przeciąganie.
 */
export function createMealPlanCard(plan, recipes, planIndex) {
  // Każdy plan ma swój unikalny identyfikator przypisany jako data-plan-id
  return `
    <li class="mealplan-card mb-3" data-plan-id="${plan.id}">
      <article class="card drop-zone">
        <header class="card-header d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0">${getDzienTygodnia(plan.date)}, ${plan.date}</h3>
          <div class="dropdown">
            <button class="btn btn-sm btn-secondary dropdown-toggle btn-three-dots" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <button class="dropdown-item" onclick="editMealPlan(${plan.id})">Edytuj plan</button>
              </li>
              <li>
                <button class="dropdown-item text-danger" onclick="deleteMealPlanById(${plan.id})">Usuń plan</button>
              </li>
            </ul>
          </div>
        </header>
        <section class="card-body">
          ${
            plan.mealPlanRecipes && plan.mealPlanRecipes.length > 0
              ? plan.mealPlanRecipes
                  .map(mpr => `
                    <div class="meal-tile draggable-recipe" 
                         draggable="true" 
                         data-mpr-id="${mpr.id}"
                         data-current-plan-id="${plan.id}"
                         ondragstart="handleDragStart(event)">
                      <p class="meal-name">${mpr.recipe.name}</p>
                      <a href="${mpr.recipe.link}" target="_blank" class="meal-recipe">Zobacz przepis</a>
                    </div>
                  `)
                  .join("")
              : `<p>Brak dodanych przepisów</p>`
          }
        </section>
        <footer class="card-footer text-center">
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

  const ulElement = document.createElement("ul");
  ulElement.classList.add("list-unstyled");

  mealPlans.forEach((plan, index) => {
    ulElement.innerHTML += createMealPlanCard(plan, recipes, index);
  });
  container.appendChild(ulElement);

  // Podpięcie obsługi drag and drop na wygenerowanych elementach
  bindDragAndDropEvents();
}

/**
 * Inicjalizuje widok planera posiłków:
 * - pobiera dane (przepisy i plany),
 * - renderuje widok,
 * - przypina obsługę modala.
 */
export async function initMealPlannerUI() {
  try {
    const recipes = await fetchRecipes();
    const mealPlans = await mealplanAPI.fetchMealPlans();
    
    renderMealPlan(mealPlans, recipes, "day-list");
    bindModalHandlers(recipes, mealPlans);
    
    return { mealPlans, recipes };
  } catch (error) {
    console.error("Błąd inicjalizacji UI:", error);
    alert("Błąd inicjalizacji planera posiłków.");
  }
}

/**
 * Przypina eventy dla przycisków otwierających modal oraz formularza.
 */
function bindModalHandlers(recipes, mealPlans) {
  document.querySelectorAll(".btn-add-recipe").forEach(btn => {
    btn.addEventListener("click", () => {
      const currentPlanId = btn.getAttribute("data-plan-id");
      btn.setAttribute("data-current-plan-id", currentPlanId);
      populateRecipesDropdown(recipes);
    });
  });

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
    const currentPlanId = document.querySelector(".btn-add-recipe[data-bs-target='#addRecipeModal']").getAttribute("data-plan-id");
  
    try {
      // rzeczywisty zapis do backendu
      await mealPlanRecipeAPI.addMealPlanRecipe({
        recipeId: selectedRecipe.id,
        mealPlanId: parseInt(currentPlanId),
        mealType: selectedMealType
      });
  
      await initMealPlannerUI(); // odśwież widok
    } catch (error) {
      console.error("Błąd przy dodawaniu przepisu:", error);
      alert("Nie udało się dodać przepisu.");
    }
  
    form.reset();
    const modalEl = document.getElementById("addRecipeModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
  });
}

/**
 * Wypełnia dropdown w modalu listą przepisów.
 */
function populateRecipesDropdown(recipes) {
  const recipeSelect = document.getElementById("recipe-select");
  recipeSelect.innerHTML = "<option value=''>-- Wybierz przepis --</option>";
  recipes.forEach(recipe => {
    recipeSelect.innerHTML += `<option value='${JSON.stringify(recipe)}'>${recipe.name}</option>`;
  });
}

/**
 * Obsługa zdarzenia dragstart – przypisuje ID przenoszonego elementu.
 */
window.handleDragStart = function(event) {
  // Przechowujemy identyfikator przypisanego przepisu (MealPlanRecipe)
  event.dataTransfer.setData("text/plain", event.target.getAttribute("data-mpr-id"));
};

/**
 * Podpięcie obsługi zdarzeń dragover i drop do wszystkich drop-zone (karty planu).
 */
function bindDragAndDropEvents() {
  const dropZones = document.querySelectorAll(".drop-zone");
  dropZones.forEach(zone => {
    // Umożliwiamy drop
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("dragover");
    });
    
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("dragover");
    });
    
    zone.addEventListener("drop", async (event) => {
      event.preventDefault();
      zone.classList.remove("dragover");
      
      // Uzyskaj ID przeciąganego elementu (MealPlanRecipe)
      const draggedMprId = event.dataTransfer.getData("text/plain");
      if (!draggedMprId) return;
      
      // ID nowego planu pobieramy z atrybutu data-plan-id drop-zone (karty planu)
      const newMealPlanId = zone.closest(".mealplan-card").getAttribute("data-plan-id");
      if (!newMealPlanId) return;
      
      try {
        // Wywołaj nowy endpoint do przeniesienia przypisania
        await mealPlanRecipeAPI.moveMealPlanRecipe(parseInt(draggedMprId, 10), parseInt(newMealPlanId, 10));
        // Po udanym przeniesieniu odśwież widok
        await initMealPlannerUI();
      } catch (error) {
        console.error("Błąd przy przenoszeniu przepisu (drag and drop):", error);
        alert("Nie udało się przenieść przepisu.");
      }
    });
  });
}

/**
 * Aktualizuje widok planów posiłków.
 */
export async function updateMealPlanUI() {
  await initMealPlannerUI();
}
