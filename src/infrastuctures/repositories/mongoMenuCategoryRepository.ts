import { Collection, ObjectId } from "mongodb";
import { MenuCategory } from "../../core/domain/menuCategory";
import { MenuCategoryRepository } from "../../core/ports/repositories";

export class MongoMenuCategoryRepository implements MenuCategoryRepository {
  constructor(private readonly collection: Collection) {}

  async save(category: MenuCategory): Promise<void> {
    try {
      const data = this.toPersistence(category);
      const { _id, ...updateData } = data; // Separate _id from the update data

      await this.collection.updateOne(
        { _id: new ObjectId(category.id) },
        { $set: updateData },
        { upsert: true }
      );
    } catch (error) {
      throw new Error("Invalid category ID format");
    }
  }

  private toPersistence(category: MenuCategory): any {
    return {
      _id: new ObjectId(category.id),
      name: category.name,
      description: category.description,
      displayOrder: category.displayOrder,
      createdAt: category.createdAt,
    };
  }

  async findById(id: string): Promise<MenuCategory | null> {
    try {
      const objectId = new ObjectId(id);
      const doc = await this.collection.findOne({ _id: objectId });
      return doc ? this.toDomain(doc) : null;
    } catch (error) {
      throw new Error("Invalid category ID format");
    }
  }

  async findAll(): Promise<MenuCategory[]> {
    const docs = await this.collection
      .find()
      .sort({ displayOrder: 1 })
      .toArray();
    return docs.map(this.toDomain);
  }

  async delete(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.collection.deleteOne({ _id: objectId });
    } catch (error) {
      throw new Error("Invalid category ID format");
    }
  }

  private toDomain(doc: any): MenuCategory {
    return new MenuCategory(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.displayOrder,
      doc.createdAt
    );
  }
}
