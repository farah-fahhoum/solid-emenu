import { Router } from 'express';
import { CategoryController } from '../../controllers/categoryController';

export const createCategoryRouter = (categoryController: CategoryController) => {
  const router = Router();

  router.get('/', (req, res) => categoryController.getAllCategories(req, res));
  router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));
  router.post('/', (req, res) => categoryController.createCategory(req, res));
  router.put('/:id', (req, res) => categoryController.updateCategory(req, res));
  router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));

  return router;
};