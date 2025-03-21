// routes/user.routes.ts
import { Router, Request, Response } from "express";
import { UserService } from "../services/user.service";

const router = Router();
const userService = new UserService();

// Pobranie wszystkich użytkowników
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Błąd przy pobieraniu użytkowników";
    res.status(500).json({ error: message });
  }
});

// Pobranie użytkownika po ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Nieprawidłowe ID" });

    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ error: "Użytkownik nie został znaleziony" });

    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Błąd przy pobieraniu użytkownika";
    res.status(500).json({ error: message });
  }
});

// Tworzenie nowego użytkownika
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email i hasło są wymagane" });

    const newUser = await userService.createUser(email, password);
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Błąd przy tworzeniu użytkownika";
    res.status(500).json({ error: message });
  }
});

// Aktualizacja użytkownika
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Nieprawidłowe ID" });

    const { email, password } = req.body;
    const updatedUser = await userService.updateUser(id, email, password);
    if (!updatedUser) return res.status(404).json({ error: "Użytkownik nie został znaleziony" });

    res.json({ id: updatedUser.id, email: updatedUser.email, updatedAt: updatedUser.updatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Błąd przy aktualizacji użytkownika";
    res.status(500).json({ error: message });
  }
});

// Usunięcie użytkownika
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Nieprawidłowe ID" });

    // Sprawdzenie, czy użytkownik istnieje przed usunięciem
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ error: "Użytkownik nie został znaleziony" });

    // Usunięcie użytkownika
    await userService.deleteUser(id);
    
    res.status(200).json({ message: "Użytkownik usunięty" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Błąd przy usuwaniu użytkownika";
    res.status(500).json({ error: message });
  }
});
export default router;
