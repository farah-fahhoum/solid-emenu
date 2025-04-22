export class MenuCategory {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public displayOrder: number,
    public readonly createdAt: Date
  ) {}
}
