import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userController = new UserController();

export const userRouter = Router();

userRouter.post("/users", authMiddleware, userController.createUser);
userRouter.get("/users", authMiddleware, userController.listUsers);
userRouter.get("/users/:id", authMiddleware, userController.getUserById);
userRouter.put("/users/:id", authMiddleware, userController.updateUser);
userRouter.delete("/users/:id", authMiddleware, userController.deleteUser);
