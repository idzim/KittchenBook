import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { connectDB } from './database/connection';
import { Recipe } from './entities/recipe';

const app = express();
app.use(express.json());

// Połączenie z bazą danych
connectDB();

// Endpoint testowy dla głównej ścieżki
app.get('/', (req: Request, res: Response) => {
  res.send('Witaj w KitchenBook API!');
});

// Przykładowy endpoint GET
app.get('/recipes', async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error });
  }
});

// Przykładowy endpoint POST
app.post('/recipes', async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;
    const recipe = new Recipe();
    recipe.name = name;
    recipe.description = description;
    recipe.category = category;
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Błąd przy dodawaniu przepisu', error });
  }
});

// Ustawienie portu serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
