import { Router } from "express";
import { socialMediaController } from "../../controllers/socialMediaController";

export const createSocialMediaRouter = (
  socialMediaController: socialMediaController
) => {
  const router = Router();

  router.get("/", (req, res) =>
    socialMediaController.getAllSocialMedia(req, res)
  );
  router.get("/:id", (req, res) =>
    socialMediaController.getSocialMediaById(req, res)
  );
  router.post("/", (req, res) =>
    socialMediaController.createSocialMedia(req, res)
  );
  router.put("/:id", (req, res) =>
    socialMediaController.updateSocialMedia(req, res)
  );
  router.delete("/:id", (req, res) =>
    socialMediaController.deleteSocialMedia(req, res)
  );

  return router;
};
