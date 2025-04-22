export class MenuItem {
    constructor(
      public readonly id: string,
      public name: string,
      public description: string,
      public price: number,
      public categoryId: string,
      public isVegetarian: boolean,
      public isVegan: boolean,
      public isGlutenFree: boolean,
      public imageUrl?: string,
      public readonly createdAt?: Date
    ) {}
  
    updatePrice(newPrice: number): void {
      if (newPrice <= 0) throw new Error("Price must be positive");
      this.price = newPrice;
    }
  }