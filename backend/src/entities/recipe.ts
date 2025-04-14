//entities/recipe.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MealPlanRecipe } from './mealplanRecipe';
import { RecipeIngredient } from './recipeIngredient';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  link!: string; // Opcjonalny link do przepisu

  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe, { cascade: true })
  ingredients!: RecipeIngredient[];

  @OneToMany(() => MealPlanRecipe, (mealPlanRecipe) => mealPlanRecipe.recipe)
  mealPlanRecipes!: MealPlanRecipe[];
}
