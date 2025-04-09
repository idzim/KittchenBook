// frontend/js/api/recipesAPI.js

const API_URL = '/api/recipes';

// Funkcja do pobierania wszystkich przepisów
export async function fetchRecipes() {
    try {
      const response = await fetch('/api/recipes');
      if (!response.ok) {
        throw new Error("Nie udało się pobrać przepisów");
      }
      const recipes = await response.json();
      console.log("Przepisy z API:", recipes); // Sprawdzamy, czy zwraca dane
      return recipes;
    } catch (error) {
      console.error("Błąd przy pobieraniu przepisów:", error);
      throw error;
    }
}
  
// Funkcja do tworzenia nowego przepisu
export async function createRecipe(recipeData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeData),
        });

        if (!response.ok) {
            throw new Error("Błąd przy tworzeniu przepisu.");
        }

        const newRecipe = await response.json();
        return newRecipe;
    } catch (error) {
        console.error("Błąd API:", error);
        throw error;
    }
}

// Funkcja do usuwania przepisu
export async function deleteRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Błąd przy usuwaniu przepisu.");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Błąd API:", error);
        throw error;
    }
}

// Funkcja do edytowania przepisu
export async function updateRecipe(id, updatedRecipeData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRecipeData),
        });

        if (!response.ok) {
            throw new Error("Błąd przy aktualizacji przepisu.");
        }

        const updatedRecipe = await response.json();
        return updatedRecipe;
    } catch (error) {
        console.error("Błąd API:", error);
        throw error;
    }
}
