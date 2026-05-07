import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const productController = new ProductController();

export const productRouter = Router();

productRouter.post("/products", authMiddleware, productController.create);
productRouter.get("/products", productController.list);
productRouter.get("/products/:id", productController.getById);
productRouter.put("/products/:id", authMiddleware, productController.update);
productRouter.delete("/products/:id", authMiddleware, productController.delete);
