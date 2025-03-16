import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MealPlan } from "./mealplan";
import { ShoppingList } from "./shoppingList";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.user)
  mealPlans: MealPlan[];

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
  shoppingLists: ShoppingList[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
