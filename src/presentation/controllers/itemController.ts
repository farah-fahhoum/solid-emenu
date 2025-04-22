import { Request, Response } from "express";
import { MenuItemRepository } from "../../core/ports/repositories";
import { MenuItem } from "../../core/domain/menuItem";
import { ObjectId } from "mongodb";

export class ItemController {
  constructor(private readonly itemRepository: MenuItemRepository) {}

  async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemRepository.findAll();
      res.json(items);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.itemRepository.findById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async getItemsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.itemRepository.findByCategory(
        req.params.categoryId
      );
      res.json(items);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async createItem(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        description,
        price,
        categoryId,
        isVegetarian,
        isVegan,
        isGlutenFree,
        imageUrl,
      } = req.body;

      if (!name || !description || price === undefined || !categoryId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      if (price <= 0) {
        res.status(400).json({ error: "Price must be positive" });
        return;
      }

      const item = new MenuItem(
        new ObjectId().toString(), // Simple ID generation
        name,
        description,
        price,
        categoryId,
        isVegetarian || false,
        isVegan || false,
        isGlutenFree || false,
        imageUrl,
        new Date()
      );

      await this.itemRepository.save(item);
      res.status(201).json(item);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const existingItem = await this.itemRepository.findById(req.params.id);
      if (!existingItem) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      const {
        name,
        description,
        price,
        categoryId,
        isVegetarian,
        isVegan,
        isGlutenFree,
        imageUrl,
      } = req.body;

      if (price !== undefined && price <= 0) {
        res.status(400).json({ error: "Price must be positive" });
        return;
      }

      const updatedItem = new MenuItem(
        existingItem.id,
        name || existingItem.name,
        description || existingItem.description,
        price ?? existingItem.price,
        categoryId || existingItem.categoryId,
        isVegetarian ?? existingItem.isVegetarian,
        isVegan ?? existingItem.isVegan,
        isGlutenFree ?? existingItem.isGlutenFree,
        imageUrl ?? existingItem.imageUrl,
        existingItem.createdAt
      );

      await this.itemRepository.save(updatedItem);
      res.json(updatedItem);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.itemRepository.findById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      await this.itemRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
}
