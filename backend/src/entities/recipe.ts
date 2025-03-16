import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MealPlanRecipe } from "./mealplanRecipe";

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("simple-array", { nullable: true })
  ingredients: string[]; // Do przeniesienia do MongoDB w przyszłości

  @Column({ nullable: true })
  link: string; // Opcjonalny link do przepisu

  @OneToMany(() => MealPlanRecipe, (mealPlanRecipe) => mealPlanRecipe.recipe)
  mealPlanRecipes: MealPlanRecipe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
