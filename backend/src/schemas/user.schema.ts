import { model, Schema } from "mongoose";

interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    tokenVersion: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const UserModel = model<UserDocument>("User", userSchema);
