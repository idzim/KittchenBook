import { Router, Request, Response } from "express";
import { ShoppingList } from "../entities/shoppingList";
import { AppDataSource } from "../database/connection";

const router = Router();

// Pobranie wszystkich list zakupów
router.get("/", async (req: Request, res: Response) => {
  try {
    const shoppingLists = await AppDataSource.getRepository(ShoppingList).find({ relations: ["user"] });
    res.json(shoppingLists);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu list zakupów" });
  }
});

// Pobranie jednej listy zakupów po ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const shoppingList = await AppDataSource.getRepository(ShoppingList).findOne({
      where: { id },
      relations: ["user"],
    });
    if (!shoppingList) {
      return res.status(404).json({ error: "Lista zakupów nie została znaleziona" });
    }
    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy pobieraniu listy zakupów" });
  }
});

// Tworzenie nowej listy zakupów
router.post("/", async (req: Request, res: Response) => {
  try {
    const { user, items } = req.body;
    const shoppingList = new ShoppingList();
    shoppingList.user = user;
    shoppingList.items = items;
    const savedList = await AppDataSource.getRepository(ShoppingList).save(shoppingList);
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy tworzeniu listy zakupów" });
  }
});

// Aktualizacja listy zakupów
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const shoppingListRepo = AppDataSource.getRepository(ShoppingList);
    let shoppingList = await shoppingListRepo.findOneBy({ id });

    if (!shoppingList) {
      return res.status(404).json({ error: "Lista zakupów nie została znaleziona" });
    }

    const { user, items } = req.body;
    shoppingList.user = user !== undefined ? user : shoppingList.user;
    shoppingList.items = items !== undefined ? items : shoppingList.items;

    const updatedList = await shoppingListRepo.save(shoppingList);
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: "Błąd przy aktualizacji listy zakupów" });
  }
});

// Usunięcie listy zakupów
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const shoppingListRepo = AppDataSource.getRepository(ShoppingList);
    const shoppingList = await shoppingListRepo.findOneBy({ id });

    if (!shoppingList) {
      return res.status(404).json({ error: "Lista zakupów nie została znaleziona" });
    }

    await shoppingListRepo.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Błąd przy usuwaniu listy zakupów" });
  }
});

export default router;
