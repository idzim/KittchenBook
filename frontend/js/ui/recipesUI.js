import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from "../api/recipesAPI.js";

// Funkcja do renderowania listy przepisów
export async function renderRecipeList() {
    const recipeListElement = document.getElementById("recipe-list");

    try {
        const recipes = await fetchRecipes();  // Pobranie przepisów z API
        if (recipes && recipes.length > 0) {
            recipeListElement.innerHTML = recipes
                .map((recipe) => {
                    return `
                        <li class="recipe-item">
                            <h3>${recipe.name}</h3>
                            <p>${recipe.description}</p>
                            <a href="${recipe.link}" target="_blank">Zobacz przepis</a>
                            <button onclick="editRecipe(${recipe.id})">Edytuj</button>
                            <button onclick="deleteRecipeById(${recipe.id})">Usuń</button>
                        </li>
                    `;
                })
                .join("");
        } else {
            recipeListElement.innerHTML = "<p>Brak przepisów do wyświetlenia.</p>";
        }
    } catch (error) {
        console.error("Błąd przy pobieraniu przepisów:", error);
        recipeListElement.innerHTML = "<p>Nie udało się pobrać przepisów. Spróbuj ponownie później.</p>";
    }
}

// Funkcja do dodawania nowego przepisu
export function handleCreateRecipe() {
    const recipeForm = document.getElementById("recipe-form");

    recipeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const recipeData = {
            name: event.target.name.value,
            description: event.target.description.value,
            link: event.target.link.value,
        };

        createRecipe(recipeData).then((newRecipe) => {
            alert("Przepis dodany!");
            renderRecipeList(); // Przeładuj listę przepisów po dodaniu
        }).catch((error) => {
            console.error("Błąd przy dodawaniu przepisu:", error);
            alert("Nie udało się dodać przepisu.");
        });
    });
}

// Funkcja do usuwania przepisu
function deleteRecipeById(id) {
    deleteRecipe(id).then((result) => {
        alert(result.message);
        renderRecipeList(); // Przeładuj listę przepisów po usunięciu
    }).catch((error) => {
        console.error("Błąd przy usuwaniu przepisu:", error);
        alert("Nie udało się usunąć przepisu.");
    });
}

// Funkcja do edytowania przepisu (przykład)
function editRecipe(id) {
    // Logika edytowania przepisu, np. wyświetlenie formularza z danymi przepisu
    alert(`Edytujesz przepis o ID: ${id}`);
}
