// js/ui/recipesUI.js
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from "../api/recipesAPI.js";

// Funkcja tworząca kartę przepisu jako element listy z dropdown menu opcji
function createRecipeCard(recipe) {
  return `
<li class="col-12 col-md-6 col-lg-4">
  <article class="card shadow-sm h-100">
    <header class="card-header bg-light">
      <h5 class="card-title mb-1">${recipe.name}</h5>
      <span class="badge bg-secondary">${recipe.category || "brak kategorii"}</span>
    </header>

    <div class="card-body">
      <p class="card-text">${recipe.description || "Brak opisu przepisu."}</p>
    </div>

    <div class="card-footer d-flex flex-wrap gap-2">
      <button class="btn btn-sm btn-outline-primary flex-fill" onclick="showRecipeDetails(${recipe.id})">
        <i class="bi bi-eye"></i> Szczegóły
      </button>
      <button class="btn btn-sm btn-outline-secondary flex-fill" onclick="editRecipe(${recipe.id})">
        <i class="bi bi-pencil"></i> Edytuj
      </button>
      <button class="btn btn-sm btn-outline-danger flex-fill" onclick="deleteRecipeById(${recipe.id})">
        <i class="bi bi-trash"></i> Usuń
      </button>
      <button class="btn btn-sm btn-outline-success flex-fill" onclick="generateShoppingList(${recipe.id})" disabled>
        <i class="bi bi-cart"></i> Lista zakupów
      </button>
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
      category: addRecipeForm.elements["recipe-category"].value,
      ingredients: []
    };

    // Pobieramy składniki z formularza
    const ingredientRows = document.querySelectorAll(".ingredient-row");
    ingredientRows.forEach((row, index) => {
      const name = row.querySelector(`[name="ingredient-name-${index}"]`)?.value;
      const amount = row.querySelector(`[name="ingredient-amount-${index}"]`)?.value;
      const unit = row.querySelector(`[name="ingredient-unit-${index}"]`)?.value;

      if (name || amount || unit) {
        recipeData.ingredients.push({
          name,
          amount: amount ? parseFloat(amount) : null,
          unit
        });
      }
    });

    createRecipe(recipeData)
      .then(() => {
        alert("Przepis dodany!");
        addRecipeForm.reset();
        document.getElementById("ingredients-list").innerHTML = ""; // czyść składniki
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
        <p><strong>Kategoria:</strong> ${recipe.category || "-"}</p>
        <p><strong>Opis:</strong> ${recipe.description}</p>
        ${recipe.ingredients?.length > 0 ? `
          <p><strong>Składniki:</strong></p>
          <ul>
            ${recipe.ingredients.map(ing => `
              <li>${ing.name || "-"}${ing.amount ? ` – ${ing.amount}` : ""}${ing.unit ? ` ${ing.unit}` : ""}</li>
            `).join("")}
          </ul>
        ` : ""}
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
        <label class="form-label">Kategoria</label>
        <select class="form-select" name="recipe-category" required>
          <option value="">Wybierz kategorię</option>
          <option value="śniadanie" ${recipe.category === "śniadanie" ? "selected" : ""}>Śniadanie</option>
          <option value="obiad" ${recipe.category === "obiad" ? "selected" : ""}>Obiad</option>
          <option value="kolacja" ${recipe.category === "kolacja" ? "selected" : ""}>Kolacja</option>
          <option value="deser" ${recipe.category === "deser" ? "selected" : ""}>Deser</option>
          <option value="inne" ${recipe.category === "inne" ? "selected" : ""}>Inne</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Opis</label>
        <textarea class="form-control" name="recipe-description" required>${recipe.description}</textarea>
      </div>

      <hr>
        <h6>Składniki</h6>
        <div id="ingredients-list-edit"></div>
        <button type="button" class="btn btn-outline-secondary btn-sm my-2" onclick="addIngredient(true)">Dodaj składnik</button>

        <div class="mb-3 mt-3">
          <label class="form-label">Link</label>
          <input class="form-control" name="recipe-link" value="${recipe.link}" required />
        </div>

        <button type="submit" class="btn btn-primary">Zapisz</button>
      </form>
        `;

      const container = document.getElementById("ingredients-list-edit");
      (recipe.ingredients || []).forEach((ing, i) => {
        container.insertAdjacentHTML("beforeend", `
        <div class="row mb-2 ingredient-row">
          <div class="col">
            <input class="form-control" name="ingredient-name-${i}" value="${ing.name || ""}" placeholder="Składnik">
          </div>
          <div class="col">
            <input class="form-control" name="ingredient-amount-${i}" value="${ing.amount ?? ""}" type="number" placeholder="Ilość">
          </div>
          <div class="col">
            <select class="form-select" name="ingredient-unit-${i}">
              <option value="">–</option>
              ${["szt.", "g", "kg", "ml", "l", "łyżka", "szklanka"].map(unit =>
              `<option value="${unit}" ${ing.unit === unit ? "selected" : ""}>${unit}</option>`
            ).join("")}
            </select>
          </div>
        </div>
      `);
      });

      const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
      modal.show();

      document.getElementById("edit-recipe-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedData = {
          name: e.target["recipe-name"].value,
          description: e.target["recipe-description"].value,
          link: e.target["recipe-link"].value,
          category: e.target["recipe-category"].value,
          ingredients: []
        };

        // Zbieramy składniki z formularza edycji
        const ingredientRows = document.querySelectorAll("#ingredients-list-edit .ingredient-row");
        ingredientRows.forEach((row, index) => {
          const name = row.querySelector(`[name="ingredient-name-${index}"]`)?.value;
          const amount = row.querySelector(`[name="ingredient-amount-${index}"]`)?.value;
          const unit = row.querySelector(`[name="ingredient-unit-${index}"]`)?.value;

          if (name || amount || unit) {
            updatedData.ingredients.push({
              name,
              amount: amount ? parseFloat(amount) : null,
              unit
            });
          }
        });

        updateRecipe(id, updatedData).then(() => {
          modal.hide();
          renderRecipeList();
          // Komunikat potwierdzający edycję (dodany komunikat)
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

// Funkcja do dodawania składnika do listy zakupów
function addIngredient(isEdit = false) {
  const container = document.getElementById(isEdit ? "ingredients-list-edit" : "ingredients-list");
  const index = container.children.length;

  container.insertAdjacentHTML("beforeend", `
    <div class="row mb-2 ingredient-row">
      <div class="col">
        <input class="form-control" name="ingredient-name-${index}" placeholder="Składnik">
      </div>
      <div class="col">
        <input class="form-control" name="ingredient-amount-${index}" type="number" placeholder="Ilość">
      </div>
      <div class="col">
        <select class="form-select" name="ingredient-unit-${index}">
          <option value="">–</option>
          <option value="szt.">szt.</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
          <option value="łyżka">łyżka</option>
          <option value="szklanka">szklanka</option>
        </select>
      </div>
    </div>
  `);
}

// Wyszukiwanie
document.getElementById("search-by-ingredients").addEventListener("click", async () => {
  const input = document.getElementById("ingredient-search").value;
  const ingredients = input.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);

  try {
    const response = await fetch("/api/recipes/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients })
    });

    if (!response.ok) throw new Error("Błąd podczas filtrowania przepisów");

    const data = await response.json();
    renderRecipeList(data);
  } catch (err) {
    console.error(err);
    alert("Nie udało się przefiltrować przepisów.");
  }
});

// Czyszczenie
document.getElementById("clear-search").addEventListener("click", async () => {
  document.getElementById("ingredient-search").value = "";
  await renderRecipeList(); // Przeładuj całą listę z API
});

// Przypisanie funkcji do obiektu globalnego dla użytku w onclick
window.deleteRecipeById = deleteRecipeById;
window.editRecipe = editRecipe;
window.addIngredient = addIngredient;
window.showRecipeDetails = showRecipeDetails;
window.generateShoppingList = generateShoppingList;
