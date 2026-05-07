import { CreateProductInput, Product, UpdateProductInput } from "../entities/product.entity.js";
import { ProductModel } from "../schemas/product.schema.js";

type ProductDoc = {
  _id: { toString(): string };
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

const mapToEntity = (doc: ProductDoc): Product => ({
  id: doc._id.toString(),
  name: doc.name,
  description: doc.description,
  price: doc.price,
  stock: doc.stock,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

export class ProductRepository {
  public async create(input: CreateProductInput): Promise<Product> {
    const doc = await ProductModel.create(input);
    return mapToEntity(doc.toObject());
  }

  public async list(): Promise<Product[]> {
    const docs = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => mapToEntity(doc as ProductDoc));
  }

  public async findById(id: string): Promise<Product | null> {
    const doc = await ProductModel.findById(id).lean();
    return doc ? mapToEntity(doc as ProductDoc) : null;
  }

  public async updateById(id: string, updates: UpdateProductInput): Promise<Product | null> {
    const doc = await ProductModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    return doc ? mapToEntity(doc as ProductDoc) : null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id).lean();
    return Boolean(result);
  }

  public async decrementStock(productId: string, quantity: number): Promise<boolean> {
    const result = await ProductModel.findOneAndUpdate(
      { _id: productId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    ).lean();

    return Boolean(result);
  }
}
