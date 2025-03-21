// services/recipe.service.ts
import { AppDataSource } from "../database/connection";
import { Recipe } from "../entities/recipe";

export class RecipeService {
  private recipeRepo = AppDataSource.getRepository(Recipe);

  // Pobranie wszystkich przepisów
  async getAllRecipes() {
    return this.recipeRepo.find();
  }

  // Pobranie przepisu po ID
  async getRecipeById(id: number) {
    return this.recipeRepo.findOneBy({ id });
  }

  // Tworzenie nowego przepisu
  async createRecipe(name: string, description: string, link: string) {
    const recipe = this.recipeRepo.create({ name, description, link });
    return this.recipeRepo.save(recipe);
  }

  // Aktualizacja przepisu
  async updateRecipe(id: number, name?: string, description?: string, link?: string) {
    const recipe = await this.recipeRepo.findOneBy({ id });
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    recipe.name = name !== undefined ? name : recipe.name;
    recipe.description = description !== undefined ? description : recipe.description;
    recipe.link = link !== undefined ? link : recipe.link;

    return this.recipeRepo.save(recipe);
  }

  // Usunięcie przepisu
  async deleteRecipe(id: number) {
    const recipe = await this.recipeRepo.findOneBy({ id });
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    await this.recipeRepo.delete(id);
  }
}
