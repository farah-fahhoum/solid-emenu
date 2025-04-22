import { Router } from "express";
import { MenuController } from "../../controllers/menuController";
import { CategoryController } from "../../controllers/categoryController";
import { socialMediaController } from "../../controllers/socialMediaController";
import { ItemController } from "../../controllers/itemController";
import { createMenuRouter } from "./menuRoutes";
import { createCategoryRouter } from "./categoryRoutes";
import { createItemRouter } from "./itemRoutes";
import { createSocialMediaRouter } from "./socialMediaRoutes";

export const createV1Router = (
  menuController: MenuController,
  categoryController: CategoryController,
  itemController: ItemController,
  socialMediaController: socialMediaController
) => {
  const router = Router();

  // Mount all routes
  router.use("/menu", createMenuRouter(menuController));
  router.use("/categories", createCategoryRouter(categoryController));
  router.use("/items", createItemRouter(itemController));
  router.use("/social", createSocialMediaRouter(socialMediaController));

  return router;
};
