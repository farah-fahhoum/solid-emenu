import { Collection, ObjectId } from "mongodb";
import { MenuItem } from "../../core/domain/menuItem";
import { MenuItemRepository } from "../../core/ports/repositories";

export class MongoMenuItemRepository implements MenuItemRepository {
  async findAll(): Promise<MenuItem[]> {
    const docs = await this.collection.find().sort({ name: 1 }).toArray();
    return docs.map(this.toDomain);
  }
  constructor(private readonly collection: Collection) {}

  async save(item: MenuItem): Promise<void> {
    try {
      const data = this.toPersistence(item);
      const { _id, ...updateData } = data;

      await this.collection.updateOne(
        { _id: new ObjectId(item.id) },
        { $set: updateData },
        { upsert: true }
      );
    } catch (error) {
      console.log(error);

      throw new Error("Invalid menu item ID format");
    }
  }

  private toPersistence(item: MenuItem): any {
    return {
      _id: new ObjectId(item.id),
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      imageUrl: item.imageUrl,
    };
  }

  async findById(id: string): Promise<MenuItem | null> {
    try {
      const objectId = new ObjectId(id);
      const doc = await this.collection.findOne({ _id: objectId });
      return doc ? this.toDomain(doc) : null;
    } catch (error) {
      throw new Error("Invalid menu item ID format");
    }
  }

  async findByCategory(categoryId: string): Promise<MenuItem[]> {
    const docs = await this.collection
      .find({ categoryId })
      .sort({ name: 1 })
      .toArray();
    return docs.map(this.toDomain);
  }

  async delete(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.collection.deleteOne({ _id: objectId });
    } catch (error) {
      throw new Error("Invalid menu item ID format");
    }
  }

  private toDomain(doc: any): MenuItem {
    return new MenuItem(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.price,
      doc.categoryId,
      doc.isVegetarian,
      doc.isVegan,
      doc.isGlutenFree,
      doc.imageUrl
    );
  }
}
