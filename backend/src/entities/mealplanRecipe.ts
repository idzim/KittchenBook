//entities/mealplanRecipe.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MealPlan } from './mealplan';
import { Recipe } from './recipe';

@Entity()
export class MealPlanRecipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MealPlan, (mealPlan) => mealPlan.mealPlanRecipes, { onDelete: 'CASCADE' })
  @JoinColumn()
  mealPlan: MealPlan;

  @ManyToOne(() => Recipe, (recipe) => recipe.mealPlanRecipes, { onDelete: 'CASCADE' })
  @JoinColumn()
  recipe: Recipe;

  @Column()
  mealType: string; // Śniadanie, obiad, kolacja

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
