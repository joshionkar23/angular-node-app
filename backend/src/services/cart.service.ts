import { Cart } from "../entities/cart.entity.js";
import { Order } from "../entities/order.entity.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { HttpError } from "../utils/http-error.js";

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository = new CartRepository(),
    private readonly productRepository: ProductRepository = new ProductRepository(),
    private readonly orderRepository: OrderRepository = new OrderRepository()
  ) {}

  public async getCart(userId: string): Promise<Cart> {
    return this.cartRepository.getOrCreateByUserId(userId);
  }

  public async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    const cart = await this.cartRepository.getOrCreateByUserId(userId);
    const existingItem = cart.items.find((item) => item.productId === productId);
    const nextQty = (existingItem?.quantity ?? 0) + quantity;

    if (nextQty > product.stock) {
      throw new HttpError(400, "Requested quantity exceeds available stock");
    }

    const nextItems = existingItem
      ? cart.items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: nextQty,
                unitPrice: product.price,
                name: product.name
              }
            : item
        )
      : [
          ...cart.items,
          {
            productId,
            quantity,
            unitPrice: product.price,
            name: product.name
          }
        ];

    return this.cartRepository.saveItems(userId, nextItems);
  }

  public async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.getOrCreateByUserId(userId);
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (!existingItem) {
      throw new HttpError(404, "Cart item not found");
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    if (quantity > product.stock) {
      throw new HttpError(400, "Requested quantity exceeds available stock");
    }

    const nextItems =
      quantity === 0
        ? cart.items.filter((item) => item.productId !== productId)
        : cart.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity,
                  unitPrice: product.price,
                  name: product.name
                }
              : item
          );

    return this.cartRepository.saveItems(userId, nextItems);
  }

  public async removeCartItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartRepository.getOrCreateByUserId(userId);
    const nextItems = cart.items.filter((item) => item.productId !== productId);
    return this.cartRepository.saveItems(userId, nextItems);
  }

  public async checkout(userId: string): Promise<Order> {
    const cart = await this.cartRepository.getOrCreateByUserId(userId);

    if (!cart.items.length) {
      throw new HttpError(400, "Cart is empty");
    }

    for (const item of cart.items) {
      const decremented = await this.productRepository.decrementStock(item.productId, item.quantity);
      if (!decremented) {
        throw new HttpError(400, `Insufficient stock for product: ${item.name}`);
      }
    }

    const total = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const order = await this.orderRepository.create({
      userId,
      items: cart.items,
      total
    });

    await this.cartRepository.clear(userId);
    return order;
  }

  public async listOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.listByUserId(userId);
  }
}
