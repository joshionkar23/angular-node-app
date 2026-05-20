import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/admin.middleware.js";

const productController = new ProductController();

export const productRouter = Router();

productRouter.post("/products", authMiddleware, adminAuthMiddleware, productController.create);
productRouter.get("/products", productController.list);
productRouter.get("/products/:id", productController.getById);
productRouter.put("/products/:id", authMiddleware, adminAuthMiddleware, productController.update);
productRouter.delete("/products/:id", authMiddleware, adminAuthMiddleware, productController.delete);
