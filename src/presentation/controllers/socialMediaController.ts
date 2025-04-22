import { Request, Response } from "express";
import { socialMediaRepository } from "../../core/ports/repositories";
import { SocialMedia } from "../../core/domain/socialMedia";
import { ObjectId } from "mongodb";

export class socialMediaController {
  constructor(private readonly socialMediaRepository: socialMediaRepository) {}
  async getAllSocialMedia(req: Request, res: Response): Promise<void> {
    try {
      const socials = await this.socialMediaRepository.findAll();
      res.json(socials);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async getSocialMediaById(req: Request, res: Response): Promise<void> {
    try {
      const social = await this.socialMediaRepository.findById(req.params.id);
      res.json(social);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async createSocialMedia(req: Request, res: Response): Promise<void> {
    try {
      const { link, socialMediaType } = req.body;
      if (!link || !socialMediaType === undefined) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const social = new SocialMedia(
        new ObjectId().toString(),
        link,
        socialMediaType,
        new Date()
      );

      await this.socialMediaRepository.save(social);
      res.status(201).json(social);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async updateSocialMedia(req: Request, res: Response): Promise<void> {
    try {
      const existingSocial = await this.socialMediaRepository.findById(
        req.params.id
      );
      if (!existingSocial) {
        res.status(404).json({ error: "Social not found" });
        return;
      }

      const { link, socialMediaType } = req.body;

      const updatedItem = new SocialMedia(
        existingSocial.id,
        link || existingSocial.link,
        socialMediaType || existingSocial.socialMediaType,
        existingSocial.createdAt
      );

      await this.socialMediaRepository.save(updatedItem);
      res.json(updatedItem);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }

  async deleteSocialMedia(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.socialMediaRepository.findById(req.params.id);
      if (!item) {
        res.status(404).json({ error: "Social not found" });
        return;
      }

      await this.socialMediaRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
}
