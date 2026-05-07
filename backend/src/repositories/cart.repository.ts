import { Cart } from "../entities/cart.entity.js";
import { CartModel } from "../schemas/cart.schema.js";

type CartDoc = {
  _id: { toString(): string };
  userId: { toString(): string };
  items: Array<{
    productId: { toString(): string };
    name: string;
    unitPrice: number;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

const mapToEntity = (doc: CartDoc): Cart => {
  const items = doc.items.map((item) => ({
    productId: item.productId.toString(),
    name: item.name,
    unitPrice: item.unitPrice,
    quantity: item.quantity
  }));

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    items,
    total,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

export class CartRepository {
  public async getOrCreateByUserId(userId: string): Promise<Cart> {
    const doc = await CartModel.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, items: [] } },
      { upsert: true, new: true }
    ).lean();

    return mapToEntity(doc as CartDoc);
  }

  public async saveItems(
    userId: string,
    items: Array<{ productId: string; name: string; unitPrice: number; quantity: number }>
  ): Promise<Cart> {
    const doc = await CartModel.findOneAndUpdate(
      { userId },
      { $set: { items } },
      { upsert: true, new: true }
    ).lean();

    return mapToEntity(doc as CartDoc);
  }

  public async clear(userId: string): Promise<void> {
    await CartModel.findOneAndUpdate({ userId }, { $set: { items: [] } }, { upsert: true });
  }
}
