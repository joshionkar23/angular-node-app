import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminAuthMiddleware } from "../middlewares/admin.middleware.js";

const controller = new CategoryController();
export const categoryRouter = Router();

categoryRouter.get("/categories", controller.list);
categoryRouter.get("/categories/:id", controller.getById);
categoryRouter.post("/categories", authMiddleware, adminAuthMiddleware, controller.create);
categoryRouter.put("/categories/:id", authMiddleware, adminAuthMiddleware, controller.update);
categoryRouter.delete("/categories/:id", authMiddleware, adminAuthMiddleware, controller.delete);
