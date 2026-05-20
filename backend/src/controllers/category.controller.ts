import { Request, Response } from "express";
import Joi from "joi";
import { CategoryService } from "../services/category.service.js";
import { HttpError } from "../utils/http-error.js";

const createSchema = Joi.object({ name: Joi.string().min(1).max(120).required(), description: Joi.string().max(1000).allow(""), slug: Joi.string().required(), imageUrl: Joi.string().uri().allow("") });

const updateSchema = Joi.object({ name: Joi.string().min(1).max(120), description: Joi.string().max(1000).allow(""), slug: Joi.string(), imageUrl: Joi.string().uri().allow("") });

export class CategoryController {
  constructor(private readonly service: CategoryService = new CategoryService()) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = createSchema.validate(req.body, { abortEarly: false });
    if (error) {
      throw new HttpError(400, "Validation failed", { details: error.details });
    }

    const category = await this.service.createCategory(value);
    res.status(201).json({ data: category });
  };

  public list = async (_req: Request, res: Response): Promise<void> => {
    const cats = await this.service.listCategories();
    res.status(200).json({ data: cats });
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const cat = await this.service.getCategoryById(String(req.params.id));
    if (!cat) throw new HttpError(404, "Category not found");
    res.status(200).json({ data: cat });
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = updateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      throw new HttpError(400, "Validation failed", { details: error.details });
    }

    const updated = await this.service.updateCategory(String(req.params.id), value);
    if (!updated) throw new HttpError(404, "Category not found");
    res.status(200).json({ data: updated });
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const ok = await this.service.deleteCategory(String(req.params.id));
    if (!ok) throw new HttpError(404, "Category not found");
    res.status(204).send();
  };
}
