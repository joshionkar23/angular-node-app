import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const cartController = new CartController();

export const cartRouter = Router();

cartRouter.use(authMiddleware);
cartRouter.get("/cart", cartController.getCart);
cartRouter.post("/cart/items", cartController.addItem);
cartRouter.put("/cart/items/:productId", cartController.updateItem);
cartRouter.delete("/cart/items/:productId", cartController.removeItem);
cartRouter.post("/cart/checkout", cartController.checkout);
cartRouter.get("/orders", cartController.listOrders);
