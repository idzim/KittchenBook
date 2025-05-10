import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/user';
import { Recipe } from '../entities/recipe';
import { MealPlan } from '../entities/mealplan';
import { MealPlanRecipe } from '../entities/mealplanRecipe';
import { ShoppingList } from '../entities/shoppingList';
import { RecipeIngredient } from '../entities/recipeIngredient';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log("ENV CHECK:", {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  db: process.env.DB_NAME,
});
dotenv.config();

// Tworzymy instancję DataSource
export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 1433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Recipe, MealPlan, MealPlanRecipe, ShoppingList, RecipeIngredient],
  extra: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  }
});

// Metoda do inicjalizacji połączenia z bazą
export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Połączenie z bazą danych nawiązane!');
  } catch (error) {
    console.error('Błąd połączenia z bazą danych: ', error);
  }
};
