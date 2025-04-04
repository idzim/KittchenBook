// frontend/js/api/recipesAPI.js

const API_URL = '/api/recipes';

// Funkcja do pobierania wszystkich przepisów
export async function fetchRecipes() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Błąd przy pobieraniu przepisów.");
        }

        const recipes = await response.json();
        return recipes;
    } catch (error) {
        console.error("Błąd API:", error);
        throw error; // Przekazujemy błąd dalej
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

// Funkcja do filtrowania przepisów
export async function filterRecipes(filters) {
    try {
        const response = await fetch(`${API_URL}/filter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filters),
        });

        if (!response.ok) {
            throw new Error("Błąd przy filtrowaniu przepisów.");
        }

        const recipes = await response.json();
        return recipes;
    } catch (error) {
        console.error("Błąd API:", error);
        throw error;
    }
}
