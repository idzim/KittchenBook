let recipes = [];

async function loadRecipes() {
  try {
    const response = await fetch("/api/recipes");
    if (!response.ok) throw new Error("Błąd pobierania przepisów");
    recipes = await response.json();
    renderDays(); // odpala się tylko po załadowaniu przepisów
  } catch (err) {
    console.error(err);
    alert("Nie udało się pobrać przepisów");
  }
}