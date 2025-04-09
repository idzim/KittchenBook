// js/ui/recipesUI.js
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from "../api/recipesAPI.js";

// Funkcja tworząca kartę przepisu jako element listy z dropdown menu opcji
function createRecipeCard(recipe) {
  return `
    <li class="recipe-card mb-3">
      <article class="card">
        <header class="card-header d-flex justify-content-between align-items-center">
          <h3 class="card-title mb-0">${recipe.name}</h3>
          <div class="dropdown">
            <!-- Przycisk z ikoną trzech kropek -->
            <button class="btn btn-sm btn-secondary dropdown-toggle btn-three-dots" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <button class="dropdown-item" onclick="showRecipeDetails(${recipe.id})">
                  Szczegóły przepisu
                </button>
              </li>
              <li>
                <button class="dropdown-item" onclick="editRecipe(${recipe.id})">
                  Edytuj przepis
                </button>
              </li>
              <li>
                <button class="dropdown-item text-danger" onclick="deleteRecipeById(${recipe.id})">
                  Usuń przepis
                </button>
              </li>
              <li>
                <button class="dropdown-item" onclick="generateShoppingList(${recipe.id})" disabled>
                  Generuj listę zakupów
                </button>
              </li>
            </ul>
          </div>
        </header>
        <div class="card-body">
          <p class="card-text">${recipe.description}</p>
        </div>
      </article>
    </li>
  `;
}

// Funkcja do renderowania listy przepisów
export async function renderRecipeList(recipesData) {
  const recipeListElement = document.getElementById("recipe-list");

  try {
    if (!recipesData) {
      console.log("Pobieranie przepisów z API...");
      recipesData = await fetchRecipes();
    }
    console.log("Dane przepisów:", recipesData);
    
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

// Obsługa formularza dodawania przepisu przez modal
export function handleCreateRecipe() {
  const addRecipeForm = document.getElementById("add-recipe-form");
  
  addRecipeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const recipeData = {
      name: addRecipeForm.elements["recipe-name"].value,
      description: addRecipeForm.elements["recipe-description"].value,
      link: addRecipeForm.elements["recipe-link"].value,
    };
    
    createRecipe(recipeData)
      .then(() => {
        alert("Przepis dodany!");
        addRecipeForm.reset();
        const addModal = bootstrap.Modal.getInstance(document.getElementById("addRecipeModal"));
        addModal.hide();
        renderRecipeList();
      })
      .catch((error) => {
        console.error("Błąd przy dodawaniu przepisu:", error);
        alert("Nie udało się dodać przepisu.");
      });
  });
}

// Funkcja do usuwania przepisu
function deleteRecipeById(id) {
  deleteRecipe(id)
    .then((result) => {
      alert(result.message);
      renderRecipeList();
    })
    .catch((error) => {
      console.error("Błąd przy usuwaniu przepisu:", error);
      alert("Nie udało się usunąć przepisu.");
    });
}

// Funkcja wyświetlająca szczegóły przepisu w modalu
function showRecipeDetails(id) {
  fetchRecipes().then(recipes => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      const modalTitle = document.getElementById("recipeModalLabel");
      const modalBody = document.getElementById("recipeModalBody");

      modalTitle.textContent = `Szczegóły: ${recipe.name}`;
      modalBody.innerHTML = `
        <p><strong>Nazwa:</strong> ${recipe.name}</p>
        <p><strong>Opis:</strong> ${recipe.description}</p>
        <p><strong>Link:</strong> <a href="${recipe.link}" target="_blank">${recipe.link}</a></p>
      `;

      const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
      modal.show();
    }
  });
}

// Funkcja edytowania przepisu z wykorzystaniem modala
function editRecipe(id) {
  fetchRecipes().then(recipes => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      const modalTitle = document.getElementById("recipeModalLabel");
      const modalBody = document.getElementById("recipeModalBody");

      modalTitle.textContent = `Edytuj: ${recipe.name}`;
      modalBody.innerHTML = `
        <form id="edit-recipe-form">
          <div class="mb-3">
            <label class="form-label">Nazwa</label>
            <input class="form-control" name="recipe-name" value="${recipe.name}" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Opis</label>
            <textarea class="form-control" name="recipe-description" required>${recipe.description}</textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Link</label>
            <input class="form-control" name="recipe-link" value="${recipe.link}" required />
          </div>
          <button type="submit" class="btn btn-primary">Zapisz</button>
        </form>
      `;

      const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
      modal.show();

      document.getElementById("edit-recipe-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedData = {
          name: e.target["recipe-name"].value,
          description: e.target["recipe-description"].value,
          link: e.target["recipe-link"].value,
        };

        updateRecipe(id, updatedData).then(() => {
          modal.hide();
          renderRecipeList();
          alert("Przepis zaktualizowany!");
        }).catch((error) => {
          console.error("Błąd przy edycji:", error);
          alert("Nie udało się zaktualizować przepisu.");
        });
      });
    }
  });
}

// Placeholder dla generowania listy zakupów
function generateShoppingList(id) {
  alert("Funkcja generowania listy zakupów jest w budowie.");
}

// Funkcja do filtrowania przepisów – wyszukaj po fragmencie nazwy; filtr tagów w budowie
export async function applyFilters() {
  const filterName = document.getElementById("filter-name").value.trim().toLowerCase();
  try {
    let recipesData = await fetchRecipes();
    if (filterName !== "") {
      recipesData = recipesData.filter(recipe =>
        recipe.name.toLowerCase().includes(filterName)
      );
    }
    renderRecipeList(recipesData);
  } catch (error) {
    console.error("Błąd przy filtrowaniu:", error);
  }
}

// Przypisanie funkcji globalnych do użytku w onclick
window.deleteRecipeById = deleteRecipeById;
window.editRecipe = editRecipe;
window.showRecipeDetails = showRecipeDetails;
window.generateShoppingList = generateShoppingList;
