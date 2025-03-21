// routes/mealplan.routes.ts
import { Router, Request, Response } from "express";
import { MealPlanService } from "../services/mealplan.service";

const router = Router();
const mealPlanService = new MealPlanService();

// Pobranie wszystkich planów posiłków
router.get("/", async (req: Request, res: Response) => {
  try {
    const mealPlans = await mealPlanService.getAllMealPlans();
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu planów posiłków" });
  }
});

// Pobranie planu posiłków po ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mealPlan = await mealPlanService.getMealPlanById(id);
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
    const savedMealPlan = await mealPlanService.createMealPlan(date, user);
    res.status(201).json(savedMealPlan);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy tworzeniu planu posiłków" });
  }
});

// Aktualizacja planu posiłków
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { date, user } = req.body;
    const updatedMealPlan = await mealPlanService.updateMealPlan(id, date, user);
    res.json(updatedMealPlan);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy aktualizacji planu posiłków" });
  }
});

// Usunięcie planu posiłków
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await mealPlanService.deleteMealPlan(id);
    res.status(200).json({ message: "Plan posiłków usunięty" });
  } catch (error) {
    res.status(500).json({ error: "Błąd przy usuwaniu planu posiłków" });
  }
});

export default router;
