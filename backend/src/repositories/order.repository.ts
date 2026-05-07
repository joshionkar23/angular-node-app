import { Order } from "../entities/order.entity.js";
import { OrderModel } from "../schemas/order.schema.js";

type OrderDoc = {
  _id: { toString(): string };
  userId: { toString(): string };
  items: Array<{
    productId: { toString(): string };
    name: string;
    unitPrice: number;
    quantity: number;
  }>;
  total: number;
  status: "placed";
  createdAt: Date;
  updatedAt: Date;
};

const mapToEntity = (doc: OrderDoc): Order => ({
  id: doc._id.toString(),
  userId: doc.userId.toString(),
  items: doc.items.map((item) => ({
    productId: item.productId.toString(),
    name: item.name,
    unitPrice: item.unitPrice,
    quantity: item.quantity
  })),
  total: doc.total,
  status: doc.status,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
});

export class OrderRepository {
  public async create(input: {
    userId: string;
    items: Array<{ productId: string; name: string; unitPrice: number; quantity: number }>;
    total: number;
  }): Promise<Order> {
    const doc = await OrderModel.create({ ...input, status: "placed" });
    return mapToEntity(doc.toObject());
  }

  public async listByUserId(userId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => mapToEntity(doc as OrderDoc));
  }
}
