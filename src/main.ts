import express from "express";
import { MongoClient } from "mongodb";
import { MongoMenuCategoryRepository } from "./infrastuctures/repositories/mongoMenuCategoryRepository";
import { MongoMenuItemRepository } from "./infrastuctures/repositories/mongoMenuItemRepository";
import { GetFullMenu } from "./application/useCases/getFullMenu";
import { MenuController } from "./presentation/controllers/menuController";
import { CategoryController } from "./presentation/controllers/categoryController";
import { ItemController } from "./presentation/controllers/itemController";
import { createV1Router } from "./presentation/routes/v1";
import { socialMediaController } from "./presentation/controllers/socialMediaController";
import { MongoSocialMediaRepository } from "./infrastuctures/repositories/mongoSocialMediaRepository";

async function bootstrap() {
  const app = express();

  // Add these middleware before your routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Database connection
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db("solid-emenu");

  // Repositories
  const categoryRepo = new MongoMenuCategoryRepository(
    db.collection("categories")
  );
  const itemRepo = new MongoMenuItemRepository(db.collection("items"));
  const socialRepo = new MongoSocialMediaRepository(
    db.collection("socialMedia")
  );

  // Use Cases
  const getFullMenu = new GetFullMenu(categoryRepo, itemRepo);

  // Controllers
  const menuController = new MenuController(getFullMenu);
  const categoryController = new CategoryController(categoryRepo);
  const itemController = new ItemController(itemRepo);
  const socialController = new socialMediaController(socialRepo);

  // Routes
  app.get("/", (req, res) => res.send("Running"));

  // API Routes v1
  app.use(
    "/api",
    createV1Router(
      menuController,
      categoryController,
      itemController,
      socialController
    )
  );

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);
