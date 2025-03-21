// services/user.service.ts
import { AppDataSource } from "../database/connection";
import { User } from "../entities/user";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  // Pobranie wszystkich użytkowników (bez haseł)
  async getAllUsers() {
    return this.userRepo.find({
      select: ["id", "email", "createdAt", "updatedAt"],
      relations: ["mealPlans", "shoppingLists"],
    });
  }

  // Pobranie użytkownika po ID (bez hasła)
  async getUserById(id: number) {
    return this.userRepo.findOne({
      where: { id },
      select: ["id", "email", "createdAt", "updatedAt"],
      relations: ["mealPlans", "shoppingLists"],
    });
  }

  // Tworzenie użytkownika (z hashowaniem hasła)
  async createUser(email: string, password: string) {
    const existingUser = await this.userRepo.findOneBy({ email });
    if (existingUser) {
      throw new Error("Użytkownik o podanym emailu już istnieje");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({ email, password: hashedPassword });
    return this.userRepo.save(user);
  }

  // Aktualizacja użytkownika (email + opcjonalne hasło)
  async updateUser(id: number, email?: string, password?: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new Error("Użytkownik nie został znaleziony");
    }

    user.email = email ?? user.email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return this.userRepo.save(user);
  }

  // Usunięcie użytkownika
  async deleteUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new Error("Użytkownik nie został znaleziony");
    }

    await this.userRepo.delete(id);
  }
}
