export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "ElectroCart Backend API",
    version: "1.0.0",
    description: "API documentation for the ElectroCart backend service."
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1",
      description: "Local development"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Products" },
    { name: "Cart" },
    { name: "Orders" },
    { name: "Users" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is healthy"
          }
        }
      }
    },
    "/ready": {
      get: {
        tags: ["Health"],
        summary: "Readiness check",
        responses: {
          "200": {
            description: "Dependencies are ready"
          },
          "503": {
            description: "Dependencies are not ready"
          }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Demo User" },
                  email: { type: "string", format: "email", example: "demo@example.com" },
                  password: { type: "string", example: "Password@123" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User registered" },
          "400": { description: "Validation error" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "demo@example.com" },
                  password: { type: "string", example: "Password@123" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Logout successful" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        responses: {
          "200": { description: "List of products" }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Product created" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Product details" },
          "404": { description: "Not found" }
        }
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Product updated" },
          "401": { description: "Unauthorized" }
        }
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Product deleted" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get current cart",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Cart details" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/cart/items": {
      post: {
        tags: ["Cart"],
        summary: "Add item to cart",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Cart updated" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/cart/items/{productId}": {
      put: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Cart updated" },
          "401": { description: "Unauthorized" }
        }
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Cart updated" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/cart/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Checkout current cart and create order",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Order created" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List current user orders",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Orders list" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Users list" },
          "401": { description: "Unauthorized" }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "User created" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "User details" },
          "401": { description: "Unauthorized" }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "User updated" },
          "401": { description: "Unauthorized" }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "User deleted" },
          "401": { description: "Unauthorized" }
        }
      }
    }
  }
} as const;
