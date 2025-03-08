import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/user';
import { Recipe } from '../entities/recipe';

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
  entities: [User, Recipe],
  extra: {
    trustServerCertificate: true,
    encrypt: false,
    enableArithAbort: true,
  },
  options: {
    encrypt: false, // Jeśli łączysz się lokalnie
  },
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
