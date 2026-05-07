import { model, Schema, Types } from "mongoose";

interface CartItemDocument {
  productId: Types.ObjectId;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface CartDocument {
  userId: Types.ObjectId;
  items: CartItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItemDocument>(
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

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const CartModel = model<CartDocument>("Cart", cartSchema);
