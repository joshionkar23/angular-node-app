import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { HttpError } from "../utils/http-error.js";

const authService = new AuthService();

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new HttpError(401, "Authorization token is required");
    }

    const token = authorization.slice("Bearer ".length).trim();
    const authUser = await authService.verifyAccessToken(token);

    req.authUser = authUser;
    next();
  } catch (error) {
    next(error);
  }
};
