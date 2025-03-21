import { Router, Request, Response } from "express";
import { Recipe } from "../entities/recipe";
import { AppDataSource } from "../database/connection";

const router = Router();

// Pobranie wszystkich przepisów
router.get("/", async (req: Request, res: Response) => {
  try {
    const recipes = await AppDataSource.getRepository(Recipe).find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu przepisów" });
  }
});

// Pobranie przepisu po ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const recipe = await AppDataSource.getRepository(Recipe).findOneBy({ id });
    if (!recipe) {
      return res.status(404).json({ error: "Przepis nie znaleziony" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu przepisu" });
  }
});

// Tworzenie nowego przepisu
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, link } = req.body;
    const recipe = new Recipe();
    recipe.name = name;
    recipe.description = description;
    recipe.link = link;
    const savedRecipe = await AppDataSource.getRepository(Recipe).save(recipe);
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy tworzeniu przepisu" });
  }
});

// Aktualizacja przepisu
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const recipeRepo = AppDataSource.getRepository(Recipe);
    let recipe = await recipeRepo.findOneBy({ id });
    if (!recipe) {
      return res.status(404).json({ error: "Przepis nie znaleziony" });
    }
    const { name, description, link } = req.body;
    recipe.name = name !== undefined ? name : recipe.name;
    recipe.description = description !== undefined ? description : recipe.description;
    recipe.link = link !== undefined ? link : recipe.link;
    const updatedRecipe = await recipeRepo.save(recipe);
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy aktualizacji przepisu" });
  }
});

// Usunięcie przepisu
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const recipeRepo = AppDataSource.getRepository(Recipe);
    const recipe = await recipeRepo.findOneBy({ id });
    if (!recipe) {
      return res.status(404).json({ error: "Przepis nie znaleziony" });
    }
    await recipeRepo.delete(id);
    res.status(200).json({ message: "Przepis usunięty" });
  } catch (error) {
    res.status(500).json({ error: "Błąd przy usuwaniu przepisu" });
  }
});

export default router;
