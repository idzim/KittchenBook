// /frontend/js/api/mealplanAPI.js

const API_URL = '/api/mealplans';

/**
 * Pobiera wszystkie plany posiłków z backendu.
 */
export async function fetchMealPlans() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Błąd przy pobieraniu planów posiłków');
    }
    return await response.json();
  } catch (error) {
    console.error('Błąd API:', error);
    throw error;
  }
}

/**
 * Tworzy nowy plan posiłków.
 * @param {Object} mealPlanData - dane planu (np. { date, user, days: [...] })
 */
export async function createMealPlan(mealPlanData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mealPlanData)
    });
    if (!response.ok) {
      throw new Error('Błąd przy tworzeniu planu posiłków');
    }
    return await response.json();
  } catch (error) {
    console.error('Błąd API:', error);
    throw error;
  }
}

/**
 * Aktualizuje istniejący plan posiłków.
 * @param {number} id - identyfikator planu
 * @param {Object} mealPlanData - zaktualizowane dane planu
 */
export async function updateMealPlan(id, mealPlanData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mealPlanData)
    });
    if (!response.ok) {
      throw new Error('Błąd przy aktualizacji planu posiłków');
    }
    return await response.json();
  } catch (error) {
    console.error('Błąd API:', error);
    throw error;
  }
}

/**
 * Usuwa plan posiłków.
 * @param {number} id - identyfikator planu do usunięcia
 */
export async function deleteMealPlan(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Błąd przy usuwaniu planu posiłków');
    }
    return await response.json();
  } catch (error) {
    console.error('Błąd API:', error);
    throw error;
  }
}
