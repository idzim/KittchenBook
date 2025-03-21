// services/shoppingList.service.ts
import { AppDataSource } from "../database/connection";
import { ShoppingList } from "../entities/shoppingList";

export class ShoppingListService {
  private shoppingListRepo = AppDataSource.getRepository(ShoppingList);

  // Pobranie wszystkich list zakupów
  async getAllShoppingLists() {
    return this.shoppingListRepo.find({ relations: ["user"] });
  }

  // Pobranie jednej listy zakupów po ID
  async getShoppingListById(id: number) {
    return this.shoppingListRepo.findOne({ where: { id }, relations: ["user"] });
  }

  // Tworzenie nowej listy zakupów
  async createShoppingList(user: any, items: string[]) {
    const shoppingList = this.shoppingListRepo.create({ user, items });
    return this.shoppingListRepo.save(shoppingList);
  }

  // Aktualizacja listy zakupów
  async updateShoppingList(id: number, user?: any, items?: string[]) {
    const shoppingList = await this.shoppingListRepo.findOneBy({ id });
    if (!shoppingList) {
      throw new Error("Shopping list not found");
    }

    shoppingList.user = user !== undefined ? user : shoppingList.user;
    shoppingList.items = items !== undefined ? items : shoppingList.items;

    return this.shoppingListRepo.save(shoppingList);
  }

  // Usunięcie listy zakupów
  async deleteShoppingList(id: number) {
    const shoppingList = await this.shoppingListRepo.findOneBy({ id });
    if (!shoppingList) {
      throw new Error("Shopping list not found");
    }

    await this.shoppingListRepo.delete(id);
  }
}
