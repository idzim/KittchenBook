import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe, filterRecipes } from "../api/recipesAPI.js";

// Funkcja tworząca kartę przepisu jako element listy
function createRecipeCard(recipe) {
  return `
    <li class="recipe-card mb-3">
      <article class="card">
        <header class="card-header">
          <h3 class="card-title">${recipe.name}</h3>
        </header>
        <div class="card-body">
          <p class="card-text">${recipe.description}</p>
        </div>
        <footer class="card-footer text-end">
          <a href="${recipe.link}" target="_blank" class="btn btn-sm btn-info">Szczegóły</a>
          <button class="btn btn-sm btn-warning" onclick="editRecipe(${recipe.id})">Edytuj</button>
          <button class="btn btn-sm btn-danger" onclick="deleteRecipeById(${recipe.id})">Usuń</button>
        </footer>
      </article>
    </li>
  `;
}

// Funkcja do renderowania listy przepisów; opcjonalnie można przekazać listę (np. po filtrowaniu)
// Funkcja do renderowania listy przepisów; opcjonalnie można przekazać listę (np. po filtrowaniu)
export async function renderRecipeList(recipesData) {
  const recipeListElement = document.getElementById("recipe-list");

  try {
    // Jeśli nie przekazano listy, pobierz wszystkie przepisy
    if (!recipesData) {
      console.log("Pobieranie przepisów z API...");
      recipesData = await fetchRecipes();
    }

    console.log("Dane przepisów:", recipesData); // Dodajemy logowanie, aby zobaczyć dane
    
    if (recipesData && recipesData.length > 0) {
      recipeListElement.innerHTML = recipesData.map(createRecipeCard).join("");
    } else {
      recipeListElement.innerHTML = "<li><p>Brak przepisów do wyświetlenia.</p></li>";
    }
  } catch (error) {
    console.error("Błąd przy pobieraniu przepisów:", error);
    recipeListElement.innerHTML = "<li><p>Nie udało się pobrać przepisów. Spróbuj ponownie później.</p></li>";
  }
}


// Funkcja do obsługi formularza dodawania nowego przepisu
export function handleCreateRecipe() {
  const recipeForm = document.getElementById("add-recipe-form");

  recipeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const recipeData = {
      name: document.getElementById("recipe-name").value,
      description: document.getElementById("recipe-description").value,
      link: document.getElementById("recipe-link").value,
    };

    createRecipe(recipeData)
      .then((newRecipe) => {
        alert("Przepis dodany!");
        renderRecipeList(); // Przeładuj listę przepisów po dodaniu
      })
      .catch((error) => {
        console.error("Błąd przy dodawaniu przepisu:", error);
        alert("Nie udało się dodać przepisu.");
      });
  });
}

// Funkcja do filtrowania przepisów przy użyciu endpointu backendu
export async function applyFilters() {
  const name = document.getElementById("filter-name").value.trim();
  const category = document.getElementById("filter-category").value.trim();
  const ingredientsStr = document.getElementById("filter-ingredients").value.trim();
  let ingredients = [];
  if (ingredientsStr) {
    ingredients = ingredientsStr.split(",").map(item => item.trim()).filter(item => item !== "");
  }
  
  const filters = { name, category, ingredients };

  try {
    const filteredRecipes = await filterRecipes(filters);
    renderRecipeList(filteredRecipes);
  } catch (error) {
    console.error("Błąd podczas filtrowania:", error);
    alert("Wystąpił błąd podczas filtrowania przepisów.");
  }
}

// Funkcja do usuwania przepisu
function deleteRecipeById(id) {
  deleteRecipe(id)
    .then((result) => {
      alert(result.message);
      renderRecipeList(); // Przeładuj listę przepisów po usunięciu
    })
    .catch((error) => {
      console.error("Błąd przy usuwaniu przepisu:", error);
      alert("Nie udało się usunąć przepisu.");
    });
}

// Funkcja do edytowania przepisu (przykład)
function editRecipe(id) {
  alert(`Edytujesz przepis o ID: ${id}`);
}

// Przypisanie funkcji do obiektu globalnego, aby mogły być wywoływane z atrybutu onclick
window.deleteRecipeById = deleteRecipeById;
window.editRecipe = editRecipe;
