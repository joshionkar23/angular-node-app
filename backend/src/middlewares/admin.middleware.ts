import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository.js";
import { HttpError } from "../utils/http-error.js";

const userRepository = new UserRepository();

export const adminAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authUser = req.authUser as { userId?: string } | undefined;

    if (!authUser || !authUser.userId) {
      throw new HttpError(401, "Authorization required");
    }

    const user = await userRepository.findById(authUser.userId);
    if (!user) {
      throw new HttpError(401, "User not found");
    }

    if (user.role !== "admin") {
      throw new HttpError(403, "Admin privileges required");
    }

    next();
  } catch (error) {
    next(error);
  }
};
