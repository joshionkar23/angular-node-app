import { model, Schema } from "mongoose";

interface CategoryDocument {
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 120, index: true },
    description: { type: String, trim: true, maxlength: 1000 },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    imageUrl: { type: String, trim: true }
  },
  { versionKey: false, timestamps: true }
);

export const CategoryModel = model<CategoryDocument>("Category", categorySchema);
