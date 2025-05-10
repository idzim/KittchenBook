// services/recipe.service.ts
import { AppDataSource } from '../database/connection';
import { Recipe } from '../entities/recipe';
import { RecipeIngredient } from '../entities/recipeIngredient';

export class RecipeService {
  private recipeRepo = AppDataSource.getRepository(Recipe);

  // Pobranie wszystkich przepisów
  async getAllRecipes() {
    return this.recipeRepo.find({ relations: ["ingredients"] });
  }

  // Pobranie przepisu po ID
  async getRecipeById(id: number) {
    return this.recipeRepo.findOne({
      where: { id },
      relations: ["ingredients"]
    });
  }

  // Tworzenie nowego przepisu
  async createRecipe(name: string, description: string, link: string, category?: string) {
    const recipe = this.recipeRepo.create({ name, description, link, category });
    return this.recipeRepo.save(recipe);
  }

  // Aktualizacja przepisu
  async updateRecipe(
    id: number,
    name?: string,
    description?: string,
    link?: string,
    category?: string,
    ingredients?: { name: string; amount?: number; unit?: string }[]
  ) {
    const recipe = await this.recipeRepo.findOne({
      where: { id },
      relations: ["ingredients"] // pobieramy też istniejące składniki
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Aktualizacja podstawowych pól
    recipe.name = name ?? recipe.name;
    recipe.description = description ?? recipe.description;
    recipe.link = link ?? recipe.link;
    recipe.category = category ?? recipe.category;

    // Nadpisanie składników (jeśli przekazano)
    if (ingredients) {
      // przypisz obiekt nadrzędny do każdego składnika
      recipe.ingredients = ingredients.map(i => {
        const ingredient = new RecipeIngredient();
        ingredient.name = i.name;
        if (i.amount !== undefined) ingredient.amount = i.amount;
        if (i.unit !== undefined) ingredient.unit = i.unit;
        ingredient.recipe = recipe; // <--- TO JEST KLUCZ
        return ingredient;
      });
    }

    return this.recipeRepo.save(recipe);
  }


  // Usunięcie przepisu
  async deleteRecipe(id: number) {
    const recipe = await this.recipeRepo.findOneBy({ id });
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    await this.recipeRepo.delete(id);
  }
  // Filtracja przepisów
  async filterRecipes(filters: { name?: string; category?: string; ingredients?: string[] }) {
    const query = AppDataSource.getRepository(Recipe)
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredient');

    if (filters.name) {
      query.andWhere('recipe.name LIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.ingredients && filters.ingredients.length > 0) {
      query.andWhere('ingredient.name IN (:...ingredients)', { ingredients: filters.ingredients });
    }

    return await query.getMany();
  }
}
