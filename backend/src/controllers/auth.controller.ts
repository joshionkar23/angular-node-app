import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { AuthService } from "../services/auth.service.js";
import { HttpError } from "../utils/http-error.js";

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }

      const result = await this.authService.register(value);
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }

      const result = await this.authService.login(value.email, value.password);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.authUser?.userId;

      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      await this.authService.logout(userId);
      res.status(200).json({ data: { message: "Logged out successfully" } });
    } catch (err) {
      next(err);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.authUser?.userId;

      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const user = await this.authService.getCurrentUser(userId);
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  };
}
