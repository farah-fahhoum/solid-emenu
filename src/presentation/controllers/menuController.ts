import { Request, Response } from 'express';
import { GetFullMenu } from '../../application/useCases/getFullMenu';

export class MenuController {
  constructor(private readonly getFullMenu: GetFullMenu) {}

  async getMenu(req: Request, res: Response): Promise<void> {
    try {
      const menu = await this.getFullMenu.execute();
      res.json(menu);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
}