// services/mealplanRecipe.service.ts
import { AppDataSource } from "../database/connection";
import { MealPlanRecipe } from "../entities/mealplanRecipe";
import { MealPlan } from "../entities/mealplan";
import { Recipe } from "../entities/recipe";

export class MealPlanRecipeService {
  private mealPlanRecipeRepo = AppDataSource.getRepository(MealPlanRecipe);

  // Pobranie wszystkich przypisanych przepisów do planów posiłków
  async getAllMealPlanRecipes() {
    return this.mealPlanRecipeRepo.find({ relations: ["mealPlan", "recipe"] });
  }

  // Pobranie przypisania przepisu do planu posiłków po ID
  async getMealPlanRecipeById(id: number) {
    return this.mealPlanRecipeRepo.findOne({
      where: { id },
      relations: ["mealPlan", "recipe"],
    });
  }

  // Dodanie nowego przypisania przepisu do planu posiłków
  async createMealPlanRecipe(mealPlan: MealPlan, recipe: Recipe, mealType: "breakfast" | "lunch" | "dinner") {
    const mealPlanRecipe = this.mealPlanRecipeRepo.create({
      mealPlan,
      recipe,
      mealType,
    });
    return this.mealPlanRecipeRepo.save(mealPlanRecipe);
  }

  // Aktualizacja przypisania przepisu do planu posiłków
  async updateMealPlanRecipe(id: number, mealPlan?: MealPlan, recipe?: Recipe, mealType?: "breakfast" | "lunch" | "dinner") {
    let mealPlanRecipe = await this.mealPlanRecipeRepo.findOneBy({ id });
    if (!mealPlanRecipe) {
      throw new Error("Meal Plan Recipe not found");
    }
    mealPlanRecipe.mealPlan = mealPlan !== undefined ? mealPlan : mealPlanRecipe.mealPlan;
    mealPlanRecipe.recipe = recipe !== undefined ? recipe : mealPlanRecipe.recipe;
    mealPlanRecipe.mealType = mealType !== undefined ? mealType : mealPlanRecipe.mealType;

    return this.mealPlanRecipeRepo.save(mealPlanRecipe);
  }

  // Usunięcie przypisania przepisu do planu posiłków
  async deleteMealPlanRecipe(id: number) {
    const mealPlanRecipe = await this.mealPlanRecipeRepo.findOneBy({ id });
    if (!mealPlanRecipe) {
      throw new Error("Meal Plan Recipe not found");
    }
    await this.mealPlanRecipeRepo.delete(id);
  }
}
