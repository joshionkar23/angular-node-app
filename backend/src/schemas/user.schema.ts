import { model, Schema } from "mongoose";

interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
  role: "user" | "admin";
  phone?: string | null;
  address?: string | null;
  profileImageUrl?: string | null;
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
    ,
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
      index: true
    },
    phone: {
      type: String,
      required: false,
      trim: true
    },
    address: {
      type: String,
      required: false,
      trim: true
    },
    profileImageUrl: {
      type: String,
      required: false,
      trim: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export const UserModel = model<UserDocument>("User", userSchema);
