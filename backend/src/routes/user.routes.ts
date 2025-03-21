import { Router, Request, Response } from "express";
import { User } from "../entities/user";
import { AppDataSource } from "../database/connection";

const router = Router();

// Pobranie wszystkich użytkowników (bez haseł)
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await AppDataSource.getRepository(User).find({
      select: ["id", "email", "createdAt", "updatedAt"],
      relations: ["mealPlans", "shoppingLists"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu użytkowników" });
  }
});

// Pobranie użytkownika po ID (bez hasła)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id },
      select: ["id", "email", "createdAt", "updatedAt"],
      relations: ["mealPlans", "shoppingLists"],
    });

    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie został znaleziony" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu użytkownika" });
  }
});

// Tworzenie nowego użytkownika
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email i hasło są wymagane" });
    }

    const userRepo = AppDataSource.getRepository(User);

    // Sprawdzenie, czy użytkownik o podanym emailu już istnieje
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Użytkownik o podanym emailu już istnieje" });
    }

    const user = new User();
    user.email = email;
    user.password = password; // W produkcji powinieneś hashować hasło przed zapisaniem!
    const savedUser = await userRepo.save(user);

    res.status(201).json({
      id: savedUser.id,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Błąd przy tworzeniu użytkownika" });
  }
});

// Aktualizacja użytkownika
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userRepo = AppDataSource.getRepository(User);
    let user = await userRepo.findOneBy({ id });

    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie został znaleziony" });
    }

    const { email, password } = req.body;
    user.email = email !== undefined ? email : user.email;
    user.password = password !== undefined ? password : user.password; // W produkcji powinieneś hashować hasło

    const updatedUser = await userRepo.save(user);
    res.json({ id: updatedUser.id, email: updatedUser.email, updatedAt: updatedUser.updatedAt });
  } catch (error) {
    res.status(500).json({ error: "Błąd przy aktualizacji użytkownika" });
  }
});

// Usunięcie użytkownika
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });

    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie został znaleziony" });
    }

    await userRepo.delete(id);
    res.status(200).json({ message: "Przepis usunięty" });
  } catch (error) {
    res.status(500).json({ error: "Błąd przy usuwaniu użytkownika" });
  }
});

export default router;
