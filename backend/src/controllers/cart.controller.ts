import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { CartService } from "../services/cart.service.js";
import { HttpError } from "../utils/http-error.js";

const addItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(0).required()
});

export class CartController {
  constructor(private readonly cartService: CartService = new CartService()) {}

  private getParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] : (value ?? "");
  }

  public getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.authUser?.userId;
      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const cart = await this.cartService.getCart(userId);
      res.status(200).json({ data: cart });
    } catch (err) {
      next(err);
    }
  };

  public addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = addItemSchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }

      const userId = req.authUser?.userId;
      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const cart = await this.cartService.addToCart(userId, value.productId, value.quantity);
      res.status(200).json({ data: cart });
    } catch (err) {
      next(err);
    }
  };

  public updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = updateQuantitySchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }

      const userId = req.authUser?.userId;
      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const cart = await this.cartService.updateCartItem(
        userId,
        this.getParam(req.params.productId),
        value.quantity
      );
      res.status(200).json({ data: cart });
    } catch (err) {
      next(err);
    }
  };

  public removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.authUser?.userId;
      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const cart = await this.cartService.removeCartItem(userId, this.getParam(req.params.productId));
      res.status(200).json({ data: cart });
    } catch (err) {
      next(err);
    }
  };

  public checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.authUser?.userId;
      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const order = await this.cartService.checkout(userId);
      res.status(201).json({ data: order });
    } catch (err) {
      next(err);
    }
  };

  public listOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.authUser?.userId;
      if (!userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const orders = await this.cartService.listOrders(userId);
      res.status(200).json({ data: orders });
    } catch (err) {
      next(err);
    }
  };
}
