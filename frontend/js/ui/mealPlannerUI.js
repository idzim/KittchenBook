let days = JSON.parse(localStorage.getItem("mealPlan")) || [
  { day: "Poniedziałek", meals: [] },
  { day: "Wtorek", meals: [] },
  { day: "Środa", meals: [] },
  { day: "Czwartek", meals: [] },
  { day: "Piątek", meals: [] },
  { day: "Sobota", meals: [] },
  { day: "Niedziela", meals: [] }
];

let recipes = [];

async function loadRecipes() {
  try {
    const response = await fetch("/api/recipes");
    if (!response.ok) throw new Error("Błąd pobierania przepisów");
    recipes = await response.json();
    renderDays(); // odpala tylko po pobraniu przepisów
  } catch (err) {
    console.error(err);
    alert("Nie udało się pobrać przepisów");
  }
}
loadRecipes();

function renderDays() {
  const dayList = document.getElementById("day-list");
  dayList.innerHTML = "";

  days.forEach((day, index) => {
    let dayTile = document.createElement("div");
    dayTile.classList.add("day-tile");
    let mealOptions = recipes.map(recipe => `<option value='${JSON.stringify(recipe)}'>${recipe.name}</option>`).join('');

    dayTile.innerHTML = `
                    <h3>${day.day}</h3>
                    <div class='meals'>
${day.meals.map((meal, mealIdx) => `
  <div class="meal-tile">
    <div class="meal-name">${meal.name}</div>

    <!-- pokaż szczegóły -->
    <a href="#" class="meal-recipe d-block"
       onclick="showRecipeDetails(${meal.id});return false;">
       Zobacz przepis
    </a>

    <!-- usuń -->
    <a href="#" class="text-danger small d-block"
       onclick="removeRecipe(${index}, ${mealIdx});return false;">
       Usuń przepis
    </a>
  </div>
`).join("")}
                    </div>
                    <div class='add-recipe'>
                        <select onchange='addRecipe(${index}, this)'>
                            <option value=''>+ Dodaj przepis</option>
                            ${mealOptions}
                        </select>
                        <button class="btn btn-sm btn-outline-primary mb-2 mt-3" onclick="generateShoppingListForDay(${index})">Lista zakupów</button>
                    </div>
                `;
    dayList.appendChild(dayTile);
  });
}

function addRecipe(dayIndex, selectElement) {
  let selectedRecipe = JSON.parse(selectElement.value);
  if (selectedRecipe) {
    days[dayIndex].meals.push(selectedRecipe);
    savePlan();
    renderDays();
  }
}

function savePlan() {
  localStorage.setItem("mealPlan", JSON.stringify(days));
  alert("Plan posiłków zapisany!");
}

function resetPlan() {
  localStorage.removeItem("mealPlan");
  location.reload();
}
function removeRecipe(dayIdx, mealIdx) {
  if (!confirm("Na pewno chcesz usunąć ten przepis?")) return;

  days[dayIdx].meals.splice(mealIdx, 1);
  savePlan();
  renderDays();
}

function generateShoppingList() {
  const allIngredients = {};

  days.forEach(day => {
    day.meals.forEach(meal => {
      meal.ingredients?.forEach(ingredient => {
        const key = `${ingredient.name} (${ingredient.unit || "-"})`;
        if (!allIngredients[key]) {
          allIngredients[key] = 0;
        }
        allIngredients[key] += ingredient.amount || 0;
      });
    });
  });

  if (Object.keys(allIngredients).length === 0) {
    alert("Brak składników do wyświetlenia.");
    return;
  }

  const list = Object.entries(allIngredients)
    .map(([key, amount]) => `${key}: ${amount}`)
    .join('\n');

  // Wyświetlenie w modalu
  document.getElementById("shoppingListContent").textContent = list;
  const modal = new bootstrap.Modal(document.getElementById("shoppingListModal"));
  modal.show();
}

function generateShoppingListForDay(dayIndex) {
  const day = days[dayIndex];
  const allIngredients = {};

  day.meals.forEach(meal => {
    meal.ingredients?.forEach(ingredient => {
      const key = `${ingredient.name} (${ingredient.unit || "-"})`;
      if (!allIngredients[key]) {
        allIngredients[key] = 0;
      }
      allIngredients[key] += ingredient.amount || 0;
    });
  });

  if (Object.keys(allIngredients).length === 0) {
    alert("Brak składników do wyświetlenia.");
    return;
  }

  const list = Object.entries(allIngredients)
    .map(([key, amount]) => `${key}: ${amount}`)
    .join('\n');

  document.getElementById("shoppingListContent").textContent = `Zakupy dla: ${day.day}\n\n` + list;
  const modal = new bootstrap.Modal(document.getElementById("shoppingListModal"));
  modal.show();
}
function copyShoppingList() {
  const content = document.getElementById("shoppingListContent").textContent;
  navigator.clipboard.writeText(content)
    .then(() => alert("Skopiowano do schowka!"))
    .catch(() => alert("Nie udało się skopiować."));
}

function showRecipeDetails(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return alert("Nie znaleziono przepisu");

  document.getElementById("recipeModalLabel").textContent = recipe.name;
  document.getElementById("recipeModalBody").innerHTML = `
    <p><strong>Kategoria:</strong> ${recipe.category || "-"}</p>
    <p><strong>Opis:</strong> ${recipe.description || "-"}</p>
    ${recipe.ingredients?.length ? `
      <h6>Składniki</h6>
      <ul>
        ${recipe.ingredients.map(i =>
    `<li>${i.name}${i.amount ? " – " + i.amount : ""}${i.unit ? " " + i.unit : ""}</li>`
  ).join("")}
      </ul>` : ""}
    ${recipe.link ? `<p><a href="${recipe.link}" target="_blank">Źródło</a></p>` : ""}
  `;
  new bootstrap.Modal(document.getElementById("recipeModal")).show();
}

renderDays();