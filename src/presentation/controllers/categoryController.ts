import { Request, Response } from "express";
import { MenuCategoryRepository } from "../../core/ports/repositories";
import { MenuCategory } from "../../core/domain/menuCategory";
import { ObjectId } from "mongodb";

export class CategoryController {
  constructor(private readonly categoryRepository: MenuCategoryRepository) {}

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryRepository.findAll();
      res.json(categories);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryRepository.findById(req.params.id);
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.json(category);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, displayOrder } = req.body;
      if (!name || !description || displayOrder === undefined) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const category = new MenuCategory(
        new ObjectId().toString(), // Generate MongoDB compatible ID
        name,
        description,
        displayOrder,
        new Date()
      );

      await this.categoryRepository.save(category);
      res.status(201).json(category);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, displayOrder } = req.body;
      const existingCategory = await this.categoryRepository.findById(
        req.params.id
      );

      if (!existingCategory) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      const updatedCategory = new MenuCategory(
        existingCategory.id,
        name || existingCategory.name,
        description || existingCategory.description,
        displayOrder ?? existingCategory.displayOrder,
        existingCategory.createdAt
      );

      await this.categoryRepository.save(updatedCategory);
      res.json(updatedCategory);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoryRepository.findById(req.params.id);
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      await this.categoryRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
}
