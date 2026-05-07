import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authController = new AuthController();

export const authRouter = Router();

authRouter.post("/auth/register", authController.register);
authRouter.post("/auth/login", authController.login);
authRouter.get("/auth/me", authMiddleware, authController.me);
authRouter.post("/auth/logout", authMiddleware, authController.logout);
