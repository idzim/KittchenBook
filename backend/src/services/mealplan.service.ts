// services/mealplan.service.ts
import { AppDataSource } from '../database/connection';
import { MealPlan } from '../entities/mealplan';
import { User } from '../entities/user';

export class MealPlanService {
  private mealPlanRepo = AppDataSource.getRepository(MealPlan);

  // Pobranie wszystkich planów posiłków
  async getAllMealPlans() {
    return this.mealPlanRepo.find({ relations: ['user', 'mealPlanRecipes'] });
  }

  // Pobranie planu posiłków po ID
  async getMealPlanById(id: number) {
    return this.mealPlanRepo.findOne({
      where: { id },
      relations: ['user', 'mealPlanRecipes'],
    });
  }

  // Tworzenie nowego planu posiłków
  async createMealPlan(date: string, user: User) {
    const mealPlan = this.mealPlanRepo.create({
      date,
      user,
    });
    return this.mealPlanRepo.save(mealPlan);
  }

  // Aktualizacja planu posiłków
  async updateMealPlan(id: number, date: string | undefined, user: User | undefined) {
    let mealPlan = await this.mealPlanRepo.findOneBy({ id });
    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }
    mealPlan.date = date !== undefined ? date : mealPlan.date;
    mealPlan.user = user !== undefined ? user : mealPlan.user;
    return this.mealPlanRepo.save(mealPlan);
  }

  // Usunięcie planu posiłków
  async deleteMealPlan(id: number) {
    const mealPlan = await this.mealPlanRepo.findOneBy({ id });
    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }
    await this.mealPlanRepo.delete(id);
  }
}

