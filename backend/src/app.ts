import express, { Request, Response } from 'express';
import { AppDataSource } from './database/connection';
import recipeRoutes from './routes/recipe.routes';
import shoppingListRoutes from './routes/shoppingList.routes';
import mealPlanRoutes from './routes/mealplan.routes';
import mealPlanRecipeRoutes from './routes/mealplanRecipe.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware do parsowania JSON
app.use(express.json());

// Inicjalizacja połączenia z bazą danych
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    // Rejestracja tras
    app.use('/recipes', recipeRoutes);
    app.use('/shopping-lists', shoppingListRoutes);
    app.use('/mealplans', mealPlanRoutes);
    app.use('/mealplan-recipes', mealPlanRecipeRoutes);
    app.use('/users', userRoutes);

    // Opcjonalnie – przykładowy endpoint główny
    app.get('/', (req: Request, res: Response) => {
      res.send('Witamy w API przepisów!');
    });

    // Uruchomienie serwera
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Błąd przy inicjalizacji Data Source:', err);
  });
