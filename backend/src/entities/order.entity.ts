import { CartItem } from "./cart.entity.js";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "placed";
  createdAt: Date;
  updatedAt: Date;
}
