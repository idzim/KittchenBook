//entities/mealplan.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { MealPlanRecipe } from './mealplanRecipe';

@Entity()
export class MealPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => User, (user) => user.mealPlans, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => MealPlanRecipe, (mealPlanRecipe) => mealPlanRecipe.mealPlan)
  mealPlanRecipes: MealPlanRecipe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
