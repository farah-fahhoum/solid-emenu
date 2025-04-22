import { Router } from 'express';
import { ItemController } from '../../controllers/itemController';

export const createItemRouter = (itemController: ItemController) => {
  const router = Router();

  router.get('/', (req, res) => itemController.getAllItems(req, res));
  router.get('/:id', (req, res) => itemController.getItemById(req, res));
  router.get('/category/:categoryId', (req, res) => itemController.getItemsByCategory(req, res));
  router.post('/', (req, res) => itemController.createItem(req, res));
  router.put('/:id', (req, res) => itemController.updateItem(req, res));
  router.delete('/:id', (req, res) => itemController.deleteItem(req, res));

  return router;
};