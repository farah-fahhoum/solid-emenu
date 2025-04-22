import { Collection, ObjectId } from "mongodb";
import { SocialMedia, SocialMediaType } from "../../core/domain/socialMedia";
import { socialMediaRepository } from "../../core/ports/repositories";

export class MongoSocialMediaRepository implements socialMediaRepository {
  constructor(private readonly collection: Collection) {}

  async findAll(): Promise<SocialMedia[]> {
    const docs = await this.collection.find().sort({ name: 1 }).toArray();
    return docs.map(this.toDomain);
  }

  async findById(id: string): Promise<SocialMedia | null> {
    try {
      const objectId = new ObjectId(id);
      const doc = await this.collection.findOne({ _id: objectId });
      return doc ? this.toDomain(doc) : null;
    } catch (error) {
      throw new Error("Invalid social media ID format");
    }
  }

  async save(social: SocialMedia): Promise<void> {
    try {
      if (!Object.values(SocialMediaType).includes(social.socialMediaType)) {
        throw new Error(`Invalid social media type: ${social.socialMediaType}`);
      }

      const data = this.toPersistence(social);
      const { _id, ...updateData } = data;

      await this.collection.updateOne(
        { _id: new ObjectId(social.id) },
        { $set: updateData },
        { upsert: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Invalid social media ID format");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const objectId = new ObjectId(id);
      await this.collection.deleteOne({ _id: objectId });
    } catch (error) {
      throw new Error("Invalid social media ID format");
    }
  }

  private toPersistence(social: SocialMedia): any {
    return {
      _id: new ObjectId(social.id),
      link: social.link,
      socialMediaType: social.socialMediaType,
    };
  }

  private toDomain(doc: any): SocialMedia {
    return new SocialMedia(
      doc._id,
      doc.link,
      doc.socialMediaType,
      doc.createdAt
    );
  }
}
