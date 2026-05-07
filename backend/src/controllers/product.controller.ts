import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ProductService } from "../services/product.service.js";

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(180).required(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required()
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(180),
  description: Joi.string().allow(""),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0)
}).min(1);

export class ProductController {
  constructor(private readonly productService: ProductService = new ProductService()) {}

  private getParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] : (value ?? "");
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }

      const product = await this.productService.createProduct(value);
      res.status(201).json({ data: product });
    } catch (err) {
      next(err);
    }
  };

  public list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.productService.listProducts();
      res.status(200).json({ data: products });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.getProductById(this.getParam(req.params.id));
      res.status(200).json({ data: product });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false });
      if (error) {
        next(error);
        return;
      }

      const product = await this.productService.updateProduct(this.getParam(req.params.id), value);
      res.status(200).json({ data: product });
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.productService.deleteProduct(this.getParam(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
