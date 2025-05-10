import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Recipe } from './recipe';

@Entity()
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // Nazwa składnika

  @Column({ nullable: true })
  amount!: number; // Ilość składnika (opcjonalnie)

  @Column({ nullable: true })
  unit!: string; // Jednostka miary (opcjonalnie)

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  recipe!: Recipe;
}
