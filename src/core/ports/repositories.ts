import { MenuCategory } from "../domain/menuCategory";
import { MenuItem } from "../domain/menuItem";
import { SocialMedia } from "../domain/socialMedia";

export interface MenuCategoryRepository {
  save(category: MenuCategory): Promise<void>;
  findById(id: string): Promise<MenuCategory | null>;
  findAll(): Promise<MenuCategory[]>;
  delete(id: string): Promise<void>;
}

export interface MenuItemRepository {
  save(item: MenuItem): Promise<void>;
  findById(id: string): Promise<MenuItem | null>;
  findByCategory(categoryId: string): Promise<MenuItem[]>;
  findAll(): Promise<MenuItem[]>;
  delete(id: string): Promise<void>;
}

export interface socialMediaRepository {
  save(social: SocialMedia): Promise<void>;
  findById(id: string): Promise<SocialMedia | null>;
  findAll(): Promise<SocialMedia[] | null>;
  delete(id: string): Promise<void>;
}
