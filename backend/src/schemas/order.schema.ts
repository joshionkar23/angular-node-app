import { model, Schema, Types } from "mongoose";

interface OrderItemDocument {
  productId: Types.ObjectId;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface OrderDocument {
  userId: Types.ObjectId;
  items: OrderItemDocument[];
  total: number;
  status: "placed";
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItemDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    _id: false
  }
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: {
      type: [orderItemSchema],
      required: true
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["placed"],
      default: "placed"
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const OrderModel = model<OrderDocument>("Order", orderSchema);
