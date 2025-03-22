// routes/mealplanRecipe.routes.ts
import { Router, Request, Response } from 'express';
import { MealPlanRecipeService } from '../services/mealplanRecipe.service';

const router = Router();
const mealPlanRecipeService = new MealPlanRecipeService();

// Pobranie wszystkich przypisanych przepisów do planów posiłków
router.get('/', async (req: Request, res: Response) => {
  try {
    const mealPlanRecipes = await mealPlanRecipeService.getAllMealPlanRecipes();
    res.json(mealPlanRecipes);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy pobieraniu listy przypisanych przepisów' });
  }
});

// Pobranie pojedynczego przypisania po ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlanRecipe = await mealPlanRecipeService.getMealPlanRecipeById(id);
    if (!mealPlanRecipe) {
      return res.status(404).json({ error: 'Nie znaleziono przypisanego przepisu' });
    }
    res.json(mealPlanRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy pobieraniu przypisanego przepisu' });
  }
});

// Dodanie nowego przypisania przepisu do planu posiłków
router.post('/', async (req: Request, res: Response) => {
  try {
    const { mealPlan, recipe, mealType } = req.body;
    const savedMealPlanRecipe = await mealPlanRecipeService.createMealPlanRecipe(
      mealPlan,
      recipe,
      mealType,
    );
    res.status(201).json(savedMealPlanRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy dodawaniu przypisanego przepisu' });
  }
});

// Aktualizacja przypisania przepisu do planu posiłków
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { mealPlan, recipe, mealType } = req.body;
    const updatedMealPlanRecipe = await mealPlanRecipeService.updateMealPlanRecipe(
      id,
      mealPlan,
      recipe,
      mealType,
    );
    res.json(updatedMealPlanRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy aktualizacji przypisanego przepisu' });
  }
});

// Usunięcie przypisania przepisu do planu posiłków
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await mealPlanRecipeService.deleteMealPlanRecipe(id);
    res.status(200).json({ message: 'Przepis usunięty' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy usuwaniu przypisanego przepisu' });
  }
});

export default router;
