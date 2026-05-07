import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { UserService } from "../services/user.service.js";

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(120),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(128)
}).min(1);

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  private getParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] : (value ?? "");
  }

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }
      const user = await this.userService.createUser(value as { name: string; email: string; password: string });
      res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  public listUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.listUsers();
      res.status(200).json({ data: users });
    } catch (err) {
      next(err);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUserById(this.getParam(req.params.id));
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }

      const user = await this.userService.updateUser(this.getParam(req.params.id), value);
      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteUser(this.getParam(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
