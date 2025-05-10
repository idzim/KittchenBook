// routes/recipe.routes.ts
import { Router, Request, Response } from 'express';
import { RecipeService } from '../services/recipe.service';

const router = Router();
const recipeService = new RecipeService();

// Pobranie wszystkich przepisów
router.get('/', async (req: Request, res: Response) => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy pobieraniu przepisów' });
  }
});

// Pobranie przepisu po ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const recipe = await recipeService.getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Przepis nie znaleziony' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy pobieraniu przepisu' });
  }
});

// Tworzenie nowego przepisu
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, link, category } = req.body;
    const savedRecipe = await recipeService.createRecipe(name, description, link);
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy tworzeniu przepisu' });
  }
});

// Aktualizacja przepisu
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, description, link, category, ingredients } = req.body;
    const updatedRecipe = await recipeService.updateRecipe(id, name, description, link, category, ingredients);

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy aktualizacji przepisu' });
  }
});

// Usunięcie przepisu
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await recipeService.deleteRecipe(id);
    res.status(200).json({ message: 'Przepis usunięty' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy usuwaniu przepisu' });
  }
});

router.post('/filter', async (req: Request, res: Response) => {
  try {
    const recipes = await recipeService.filterRecipes(req.body);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy filtrowaniu przepisów' });
  }
});

export default router;
