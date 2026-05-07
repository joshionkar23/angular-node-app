import { CreateProductInput, Product, UpdateProductInput } from "../entities/product.entity.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { HttpError } from "../utils/http-error.js";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository = new ProductRepository()) {}

  public async createProduct(input: CreateProductInput): Promise<Product> {
    return this.productRepository.create(input);
  }

  public async listProducts(): Promise<Product[]> {
    return this.productRepository.list();
  }

  public async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    return product;
  }

  public async updateProduct(id: string, updates: UpdateProductInput): Promise<Product> {
    const product = await this.productRepository.updateById(id, updates);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    return product;
  }

  public async deleteProduct(id: string): Promise<void> {
    const isDeleted = await this.productRepository.deleteById(id);

    if (!isDeleted) {
      throw new HttpError(404, "Product not found");
    }
  }
}
