// routes/shoppingList.routes.ts
import { Router, Request, Response } from 'express';
import { ShoppingListService } from '../services/shoppingList.service';

const router = Router();
const shoppingListService = new ShoppingListService();

// Pobranie wszystkich list zakupów
router.get('/', async (req: Request, res: Response) => {
  try {
    const shoppingLists = await shoppingListService.getAllShoppingLists();
    res.json(shoppingLists);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy pobieraniu list zakupów' });
  }
});

// Pobranie jednej listy zakupów po ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const shoppingList = await shoppingListService.getShoppingListById(id);
    if (!shoppingList) {
      return res.status(404).json({ error: 'Lista zakupów nie została znaleziona' });
    }
    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy pobieraniu listy zakupów' });
  }
});

// Tworzenie nowej listy zakupów
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user, items } = req.body;
    const savedList = await shoppingListService.createShoppingList(user, items);
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy tworzeniu listy zakupów' });
  }
});

// Aktualizacja listy zakupów
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { user, items } = req.body;
    const updatedList = await shoppingListService.updateShoppingList(id, user, items);
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy aktualizacji listy zakupów' });
  }
});

// Usunięcie listy zakupów
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await shoppingListService.deleteShoppingList(id);
    res.status(200).json({ message: 'Lista zakupów usunięta' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd przy usuwaniu listy zakupów' });
  }
});

export default router;
