import { CategoryModel } from "../schemas/category.schema.js";

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const map = (doc: any): Category => ({
  id: doc._id.toString(),
  name: doc.name,
  description: doc.description,
  slug: doc.slug,
  imageUrl: doc.imageUrl,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

export class CategoryRepository {
  public async create(input: { name: string; description?: string; slug: string; imageUrl?: string }): Promise<Category> {
    const doc = await CategoryModel.create(input as any);
    return map((doc as any).toObject ? (doc as any).toObject() : doc);
  }

  public async list(): Promise<Category[]> {
    const docs = await CategoryModel.find().sort({ name: 1 }).lean();
    return docs.map(map);
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const doc = await CategoryModel.findOne({ slug }).lean();
    return doc ? map(doc) : null;
  }

  public async findById(id: string): Promise<Category | null> {
    const doc = await CategoryModel.findById(id).lean();
    return doc ? map(doc) : null;
  }

  public async updateById(id: string, updates: Partial<{ name: string; description: string; slug: string; imageUrl: string }>): Promise<Category | null> {
    const doc = await CategoryModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    return doc ? map(doc) : null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const doc = await CategoryModel.findByIdAndDelete(id).lean();
    return Boolean(doc);
  }
}
