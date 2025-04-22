import { MenuCategoryRepository } from "../../core/ports/repositories";
import { MenuItemRepository } from "../../core/ports/repositories";

export interface FullMenu {
  categories: {
    id: string;
    name: string;
    description: string;
    items: {
      id: string;
      name: string;
      description: string;
      price: number;
      dietaryInfo: {
        isVegetarian: boolean;
        isVegan: boolean;
        isGlutenFree: boolean;
      };
    }[];
  }[];
}

export class GetFullMenu {
  constructor(
    private readonly categoryRepository: MenuCategoryRepository,
    private readonly itemRepository: MenuItemRepository
  ) {}

  async execute(): Promise<FullMenu> {
    const categories = await this.categoryRepository.findAll();
    const menu: FullMenu = { categories: [] };

    for (const category of categories) {
      const items = await this.itemRepository.findByCategory(category.id);
      
      menu.categories.push({
        id: category.id,
        name: category.name,
        description: category.description,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          dietaryInfo: {
            isVegetarian: item.isVegetarian,
            isVegan: item.isVegan,
            isGlutenFree: item.isGlutenFree
          }
        }))
      });
    }

    return menu;
  }
}