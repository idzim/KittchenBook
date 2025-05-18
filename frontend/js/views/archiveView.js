document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("mealplan-archive-list");
  const sortSelect = document.getElementById("sort-select");

  async function fetchAndRenderPlans() {
    const [sortBy, order] = sortSelect.value.split("-");
    const res = await fetch(`/api/mealplans/archive?sortBy=${sortBy}&order=${order}`);
    const plans = await res.json();

    list.innerHTML = plans.map(plan => `
      <div class="card mb-3">
        <div class="card-header">📅 ${plan.date}</div>
        <div class="card-body">
          ${plan.mealPlanRecipes?.map(m => `
            <div><strong>${m.mealType}</strong>: ${m.recipe?.name || 'Brak przepisu'}</div>
          `).join("") || "<em>Brak przypisanych przepisów</em>"}
        </div>
      </div>
    `).join("");
  }

  sortSelect.addEventListener("change", fetchAndRenderPlans);
  fetchAndRenderPlans();
});