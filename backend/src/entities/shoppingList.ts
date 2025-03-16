import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.shoppingLists, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column("simple-array")
  items: string[]; // Lista zakupów w formie prostego arraya

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
