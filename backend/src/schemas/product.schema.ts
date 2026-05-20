import { model, Schema } from "mongoose";

interface ProductDocument {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
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
    ,
    category: {
      type: String,
      required: false,
      trim: true,
      index: true
    },
    images: {
      type: [String],
      required: false,
      default: []
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      required: false,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const ProductModel = model<ProductDocument>("Product", productSchema);
