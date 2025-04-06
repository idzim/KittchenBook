import express, { Request, Response } from 'express';
import path from 'path';
import { AppDataSource } from './database/connection';
import recipeRoutes from './routes/recipe.routes';
import shoppingListRoutes from './routes/shoppingList.routes';
import mealPlanRoutes from './routes/mealplan.routes';
import mealPlanRecipeRoutes from './routes/mealplanRecipe.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware do parsowania JSON
app.use(express.json());

// Serwowanie plików statycznych z folderu frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Inicjalizacja połączenia z bazą danych
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    // Rejestracja tras API
    app.use('/api/recipes', recipeRoutes); // zmieniłem ścieżkę do '/api/recipes', aby odróżnić API od frontendowych plików
    app.use('/api/shopping-lists', shoppingListRoutes);
    app.use('/api/mealplans', mealPlanRoutes);
    app.use('/api/mealplan-recipes', mealPlanRecipeRoutes);
    app.use('/api/users', userRoutes);

    // Opcjonalnie – przykładowy endpoint główny
    app.get('/', (req: Request, res: Response) => {
      res.send('Witamy w API przepisów!');
    });

    // Uruchomienie serwera
    const PORT = process.env.PORT || 3000;
    app.listen(3000, '0.0.0.0', () => {
      console.log(`Serwer działa na porcie http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Błąd przy inicjalizacji Data Source:', err);
  });
