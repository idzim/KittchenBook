import { Router, Request, Response } from "express";
import { MealPlan } from "../entities/mealplan";
import { AppDataSource } from "../database/connection";

const router = Router();

// Pobranie wszystkich planów posiłków
router.get("/", async (req: Request, res: Response) => {
  try {
    const mealPlans = await AppDataSource.getRepository(MealPlan).find({ relations: ["user", "mealPlanRecipes"] });
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu planów posiłków" });
  }
});

// Pobranie planu posiłków po ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlan = await AppDataSource.getRepository(MealPlan).findOne({
      where: { id },
      relations: ["user", "mealPlanRecipes"],
    });
    if (!mealPlan) {
      return res.status(404).json({ error: "Plan posiłków nie znaleziony" });
    }
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu planu posiłków" });
  }
});

// Tworzenie nowego planu posiłków
router.post("/", async (req: Request, res: Response) => {
  try {
    const { date, user } = req.body;
    const mealPlan = new MealPlan();
    mealPlan.date = date;
    mealPlan.user = user; // Oczekujemy ID użytkownika lub obiektu User
    const savedMealPlan = await AppDataSource.getRepository(MealPlan).save(mealPlan);
    res.status(201).json(savedMealPlan);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy tworzeniu planu posiłków" });
  }
});

// Aktualizacja planu posiłków
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlanRepo = AppDataSource.getRepository(MealPlan);
    let mealPlan = await mealPlanRepo.findOneBy({ id });
    if (!mealPlan) {
      return res.status(404).json({ error: "Plan posiłków nie znaleziony" });
    }
    const { date, user } = req.body;
    mealPlan.date = date !== undefined ? date : mealPlan.date;
    mealPlan.user = user !== undefined ? user : mealPlan.user;
    const updatedMealPlan = await mealPlanRepo.save(mealPlan);
    res.json(updatedMealPlan);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy aktualizacji planu posiłków" });
  }
});

// Usunięcie planu posiłków
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlanRepo = AppDataSource.getRepository(MealPlan);
    const mealPlan = await mealPlanRepo.findOneBy({ id });
    if (!mealPlan) {
      return res.status(404).json({ error: "Plan posiłków nie znaleziony" });
    }
    await mealPlanRepo.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Błąd przy usuwaniu planu posiłków" });
  }
});

export default router;
