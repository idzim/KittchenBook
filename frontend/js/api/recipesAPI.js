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

// ---------- PRZYKŁADOWE PRZEPISY + SEEDER ----------
const sampleRecipes = [
  {
    name: "Owsianka bananowa",
    category: "śniadanie",
    description: "Szybka owsianka z bananem, masłem orzechowym i miodem.",
    link: "https://przyklad.pl/owsianka-bananowa",
    ingredients: [
      { name: "Płatki owsiane", amount: 60, unit: "g" },
      { name: "Mleko",          amount: 250, unit: "ml" },
      { name: "Banan",          amount: 1,   unit: "szt." },
      { name: "Masło orzechowe",amount: 1,   unit: "łyżka" },
      { name: "Miód",           amount: 1,   unit: "łyżeczka" },
    ],
  },
  {
    name: "Kurczak curry",
    category: "obiad",
    description: "Rozgrzewające curry z kurczakiem, warzywami i mlekiem kokosowym.",
    link: "https://przyklad.pl/kurczak-curry",
    ingredients: [
      { name: "Pierś z kurczaka", amount: 300, unit: "g" },
      { name: "Mieszanka warzyw", amount: 300, unit: "g" },
      { name: "Mleko kokosowe",   amount: 400, unit: "ml" },
      { name: "Pasta curry",      amount: 2,   unit: "łyżka" },
      { name: "Ryż basmati",      amount: 150, unit: "g" },
    ],
  },
  {
    name: "Sałatka grecka",
    category: "kolacja",
    description: "Klasyczna sałatka z fetą, oliwkami i warzywami.",
    link: "https://przyklad.pl/salatka-grecka",
    ingredients: [
      { name: "Pomidor",       amount: 2,   unit: "szt." },
      { name: "Ogórek",        amount: 1,   unit: "szt." },
      { name: "Papryka",       amount: 1,   unit: "szt." },
      { name: "Ser feta",      amount: 150, unit: "g" },
      { name: "Oliwki czarne", amount: 50,  unit: "g" },
      { name: "Oliwa z oliwek",amount: 2,   unit: "łyżka" },
    ],
  },
  {
    name: "Spaghetti bolognese",
    category: "obiad",
    description: "Makaron w sosie pomidorowym z mięsem wołowym.",
    link: "https://przyklad.pl/spaghetti-bolognese",
    ingredients: [
      { name: "Makaron spaghetti",     amount: 250, unit: "g" },
      { name: "Mięso mielone wołowe",  amount: 300, unit: "g" },
      { name: "Pomidory pelati",       amount: 400, unit: "g" },
      { name: "Cebula",                amount: 1,   unit: "szt." },
      { name: "Czosnek",               amount: 2,   unit: "ząbki" },
    ],
  },
  {
    name: "Zielone smoothie",
    category: "przekąska",
    description: "Witaminowe smoothie z jarmużem, jabłkiem i kiwi.",
    link: "https://przyklad.pl/zielone-smoothie",
    ingredients: [
      { name: "Jarmuż", amount: 40,  unit: "g" },
      { name: "Jabłko", amount: 1,   unit: "szt." },
      { name: "Kiwi",   amount: 1,   unit: "szt." },
      { name: "Woda",   amount: 200, unit: "ml" },
      { name: "Miód",   amount: 1,   unit: "łyżeczka" },
    ],
  },
];

export async function seedSampleRecipes() {
  for (const recipe of sampleRecipes) {
    try {
      await createRecipe(recipe);   // <- już zdefiniowane wyżej w pliku
    } catch (err) {
      console.warn(`${recipe.name} – pominięto (${err.message})`);
    }
  }
}

