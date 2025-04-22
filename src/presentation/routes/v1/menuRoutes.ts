import { Router } from 'express';
import { MenuController } from '../../controllers/menuController';

export const createMenuRouter = (menuController: MenuController) => {
  const router = Router();

  router.get('/', (req, res) => menuController.getMenu(req, res));

  return router;
};