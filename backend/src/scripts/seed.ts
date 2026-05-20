import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { CartModel } from "../schemas/cart.schema.js";
import { OrderModel } from "../schemas/order.schema.js";
import { ProductModel } from "../schemas/product.schema.js";
import { CategoryModel } from "../schemas/category.schema.js";
import { UserModel } from "../schemas/user.schema.js";

const seed = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);

  await Promise.all([
    UserModel.deleteMany({}),
    ProductModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    CartModel.deleteMany({}),
    OrderModel.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash("Password@123", 10);

  const users = await UserModel.insertMany([
    {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash,
      tokenVersion: 0
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      tokenVersion: 0,
      role: "admin"
    }
  ]);

  const products = await ProductModel.insertMany([
    {
      name: "Wireless Mouse",
      description: "Ergonomic 2.4G wireless mouse",
      price: 799,
      stock: 50
    },
    {
      name: "Mechanical Keyboard",
      description: "Hot-swappable blue switches",
      price: 3499,
      stock: 25
    },
    {
      name: "USB-C Hub",
      description: "6-in-1 USB-C docking hub",
      price: 2199,
      stock: 40
    },
    {
      name: "27-inch Monitor",
      description: "Full HD IPS display monitor",
      price: 12499,
      stock: 18
    },
    {
      name: "Gaming Headset",
      description: "Over-ear headset with noise isolation",
      price: 2899,
      stock: 30
    },
    {
      name: "Bluetooth Speaker",
      description: "Portable speaker with deep bass",
      price: 1799,
      stock: 45
    },
    {
      name: "Webcam 1080p",
      description: "Auto-focus USB webcam for meetings",
      price: 2599,
      stock: 22
    },
    {
      name: "External SSD 1TB",
      description: "High-speed USB 3.2 portable SSD",
      price: 6999,
      stock: 16
    },
    {
      name: "Laptop Stand",
      description: "Adjustable aluminum stand",
      price: 1299,
      stock: 55
    },
    {
      name: "Wireless Charger",
      description: "15W fast wireless charging pad",
      price: 999,
      stock: 60
    },
    {
      name: "Smart Watch",
      description: "Fitness and notification tracking",
      price: 5499,
      stock: 20
    },
    {
      name: "Power Bank 20000mAh",
      description: "Dual USB output fast charging",
      price: 1899,
      stock: 38
    },
    {
      name: "USB-C Cable 2m",
      description: "Durable braided charging cable",
      price: 399,
      stock: 120
    },
    {
      name: "HDMI Cable",
      description: "4K compatible HDMI 2.1 cable",
      price: 699,
      stock: 80
    },
    {
      name: "Desk Lamp",
      description: "LED lamp with brightness control",
      price: 1499,
      stock: 33
    },
    {
      name: "Office Chair",
      description: "Ergonomic mesh back support chair",
      price: 8499,
      stock: 12
    },
    {
      name: "Wireless Earbuds",
      description: "True wireless earbuds with mic",
      price: 3299,
      stock: 42
    },
    {
      name: "Graphic Tablet",
      description: "Drawing tablet for digital artists",
      price: 5999,
      stock: 14
    },
    {
      name: "Router AX3000",
      description: "Dual-band Wi-Fi 6 router",
      price: 4599,
      stock: 19
    },
    {
      name: "Mechanical Numpad",
      description: "Compact programmable numpad",
      price: 1899,
      stock: 27
    }
  ]);

  // Seed categories and assign to products
  const categoriesToInsert = [
    { name: "Electronics", slug: "electronics", description: "Gadgets and devices" },
    { name: "Computers", slug: "computers", description: "Laptops, monitors and accessories" },
    { name: "Audio", slug: "audio", description: "Headphones, speakers" },
    { name: "Office", slug: "office", description: "Office supplies and furniture" },
    { name: "Mobile", slug: "mobile", description: "Phones and accessories" }
  ];

  const categories = await CategoryModel.insertMany(categoriesToInsert);

  await Promise.all(
    products.map((p: any, i: number) => {
      const cat = categories[i % categories.length];
      return ProductModel.findByIdAndUpdate(p._id, { category: cat.slug }).lean();
    })
  );

  logger.info("Seed completed", {
    users: users.length,
    products: products.length,
    db: env.MONGODB_URI
  });

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  logger.error("Seed failed", { err: error });
  try {
    await mongoose.disconnect();
  } catch {
    // no-op
  }
  process.exit(1);
});
