import { model, Schema } from "mongoose";

interface ProductDocument {
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 180
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const ProductModel = model<ProductDocument>("Product", productSchema);
