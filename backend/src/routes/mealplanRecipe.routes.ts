import { Router, Request, Response } from "express";
import { MealPlanRecipe } from "../entities/mealplanRecipe";
import { AppDataSource } from "../database/connection";

const router = Router();

// Pobranie wszystkich przypisanych przepisów do planów posiłków
router.get("/", async (req: Request, res: Response) => {
  try {
    const mealPlanRecipes = await AppDataSource.getRepository(MealPlanRecipe).find({ relations: ["mealPlan", "recipe"] });
    res.json(mealPlanRecipes);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu listy przypisanych przepisów" });
  }
});

// Pobranie pojedynczego przypisania po ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlanRecipe = await AppDataSource.getRepository(MealPlanRecipe).findOne({
      where: { id },
      relations: ["mealPlan", "recipe"],
    });
    if (!mealPlanRecipe) {
      return res.status(404).json({ error: "Nie znaleziono przypisanego przepisu" });
    }
    res.json(mealPlanRecipe);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu przypisanego przepisu" });
  }
});

// Dodanie nowego przypisania przepisu do planu posiłków
router.post("/", async (req: Request, res: Response) => {
  try {
    const { mealPlan, recipe, mealType } = req.body;
    const mealPlanRecipe = new MealPlanRecipe();
    mealPlanRecipe.mealPlan = mealPlan;
    mealPlanRecipe.recipe = recipe;
    mealPlanRecipe.mealType = mealType;
    const savedMealPlanRecipe = await AppDataSource.getRepository(MealPlanRecipe).save(mealPlanRecipe);
    res.status(201).json(savedMealPlanRecipe);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy dodawaniu przypisanego przepisu" });
  }
});

// Aktualizacja przypisania przepisu do planu posiłków
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlanRecipeRepo = AppDataSource.getRepository(MealPlanRecipe);
    let mealPlanRecipe = await mealPlanRecipeRepo.findOneBy({ id });

    if (!mealPlanRecipe) {
      return res.status(404).json({ error: "Nie znaleziono przypisanego przepisu" });
    }

    const { mealPlan, recipe, mealType } = req.body;
    mealPlanRecipe.mealPlan = mealPlan !== undefined ? mealPlan : mealPlanRecipe.mealPlan;
    mealPlanRecipe.recipe = recipe !== undefined ? recipe : mealPlanRecipe.recipe;
    mealPlanRecipe.mealType = mealType !== undefined ? mealType : mealPlanRecipe.mealType;

    const updatedMealPlanRecipe = await mealPlanRecipeRepo.save(mealPlanRecipe);
    res.json(updatedMealPlanRecipe);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy aktualizacji przypisanego przepisu" });
  }
});

// Usunięcie przypisania przepisu do planu posiłków
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlanRecipeRepo = AppDataSource.getRepository(MealPlanRecipe);
    const mealPlanRecipe = await mealPlanRecipeRepo.findOneBy({ id });

    if (!mealPlanRecipe) {
      return res.status(404).json({ error: "Nie znaleziono przypisanego przepisu" });
    }

    await mealPlanRecipeRepo.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Błąd przy usuwaniu przypisanego przepisu" });
  }
});

export default router;
