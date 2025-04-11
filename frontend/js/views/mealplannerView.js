// frontend/js/views/mealplannerView.js

import { renderMealPlan } from "../ui/mealplannerUI.js";
import * as mealplanAPI from "../api/mealplanAPI.js";
import { fetchRecipes } from "../api/recipesAPI.js";

let mealPlans = []; // Tablica planów pobranych z backendu
let recipes = [];

/**
 * Dodaje przepis do wybranego planu posiłków.
 * @param {number} planIndex - indeks planu w tablicy mealPlans.
 * @param {HTMLSelectElement} selectElement - element select, z którego pobieramy wybrany przepis.
 */
async function addRecipe(planIndex, selectElement) {
  if (selectElement.value) {
    const selectedRecipe = JSON.parse(selectElement.value);
    // Upewniamy się, że właściwość mealPlanRecipes istnieje
    mealPlans[planIndex].mealPlanRecipes = mealPlans[planIndex].mealPlanRecipes || [];
    mealPlans[planIndex].mealPlanRecipes.push(selectedRecipe);
    try {
      // Aktualizujemy wybrany plan w bazie
      await mealplanAPI.updateMealPlan(mealPlans[planIndex].id, mealPlans[planIndex]);
      updateView();
    } catch (error) {
      alert("Nie udało się zaktualizować planu.");
    }
  }
}

/**
 * Renderuje widok na podstawie aktualnych danych.
 */
function updateView() {
  renderMealPlan(mealPlans, recipes, "day-list", addRecipe);
}

/**
 * Zapisuje zmiany dla wszystkich planów.
 */
async function savePlan() {
  try {
    for (const plan of mealPlans) {
      await mealplanAPI.updateMealPlan(plan.id, plan);
    }
    alert("Plan posiłków zapisany!");
  } catch (error) {
    alert("Błąd przy zapisie planu.");
  }
}

/**
 * Resetuje wszystkie plany posiłków (czyści listy przepisów).
 */
async function resetPlan() {
  try {
    for (const plan of mealPlans) {
      plan.mealPlanRecipes = [];
      await mealplanAPI.updateMealPlan(plan.id, plan);
    }
    updateView();
  } catch (error) {
    alert("Błąd przy resetowaniu planu.");
  }
}

/**
 * Inicjalizuje widok planera posiłków:
 * 1. Pobiera dostępne przepisy.
 * 2. Pobiera listę planów posiłków z backendu.
 * 3. Podłącza zdarzenia dla przycisków.
 * 4. Renderuje widok.
 */
export async function initMealPlanner() {
  try {
    // Pobieramy przepisy (np. z backendu)
    recipes = await fetchRecipes();

    // Pobieramy listę planów posiłków
    mealPlans = await mealplanAPI.fetchMealPlans();

    // Podpinamy zdarzenia dla przycisków zapisu i resetu
    document.getElementById("btn-save").addEventListener("click", savePlan);
    document.getElementById("btn-reset").addEventListener("click", resetPlan);

    // Renderujemy widok
    updateView();
  } catch (error) {
    console.error("Błąd inicjalizacji planera:", error);
    alert("Błąd inicjalizacji planera posiłków.");
  }
}
