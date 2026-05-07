# E-Commerce API - Postman Setup & Testing Guide

## Import Postman Collection

### Step 1: Download Collection
1. The collection file is located at: `E-Commerce-API.postman_collection.json` (in the backend folder)
2. Copy this file to a location on your computer

### Step 2: Import into Postman
1. Open **Postman** desktop app
2. Click **Import** button (top-left corner)
3. Select **Upload Files**
4. Browse and select `E-Commerce-API.postman_collection.json`
5. Click **Import**

### Step 3: Verify Collection
You should see a new collection named **"E-Commerce API"** in the left sidebar with all endpoints organized in folders:
- Auth
- Users
- Products
- Cart
- Checkout & Orders
- Health Check

## Environment Setup

### Variables Pre-configured
The collection already includes environment variables:
- `baseUrl` = `http://localhost:4000`
- `accessToken` = (auto-populated after login)
- `userId` = (auto-populated after login)
- `productId` = (auto-populated after creating a product)

## Testing Workflow

### 1. Start Server
```bash
cd backend
npm run dev
```
Expected output: `API server listening on port 4000`

### 2. Seed Sample Data (Optional but Recommended)
```bash
npm run seed
```
This creates demo users and products.

Demo credentials:
- Email: `demo@example.com`
- Password: `Password@123`

### 3. Test Health Check First
1. Open Postman
2. Navigate to **Health Check** > **Health**
3. Click **Send**
4. Should return `200 OK` with status: "ok"

### 4. Authentication Flow

#### Option A: Login with Demo User
1. Go to **Auth** > **Login**
2. Request body is pre-filled with `demo@example.com` and `Password@123`
3. Click **Send**
4. Response includes `accessToken` and `user` object
5. **Token auto-saves** to `{{accessToken}}` variable

#### Option B: Register New User
1. Go to **Auth** > **Register**
2. Update body with your details:
   ```json
   {
     "name": "Your Name",
     "email": "your@example.com",
     "password": "StrongPassword@123"
   }
   ```
3. Click **Send**
4. Returns new user and `accessToken`
5. **Token auto-saves** to `{{accessToken}}` variable

### 5. Test Products (No Auth Required)

#### List Products
1. Go to **Products** > **List All Products**
2. Click **Send**
3. Returns all products with seeded data

#### Create Product
1. Go to **Products** > **Create Product**
2. Update body (optional):
   ```json
   {
     "name": "Your Product",
     "description": "Product description",
     "price": 5999,
     "stock": 30
   }
   ```
3. Click **Send**
4. Returns new product
5. **Product ID auto-saves** to `{{productId}}` variable

#### Get Product by ID
1. Go to **Products** > **Get Product By ID**
2. Click **Send**
3. Uses `{{productId}}` from previous request

#### Update Product
1. Go to **Products** > **Update Product**
2. Update body with new values:
   ```json
   {
     "price": 9999,
     "stock": 50
   }
   ```
3. Click **Send**

#### Delete Product
1. Go to **Products** > **Delete Product**
2. Click **Send**
3. Returns `204 No Content` (success)

### 6. Test Cart (Requires Authentication)

**Important:** Complete Step 4 (Login/Register) first to get `accessToken`

#### Get Cart
1. Go to **Cart** > **Get Cart**
2. Bearer token is **auto-applied** from `{{accessToken}}`
3. Click **Send**
4. Returns your cart (empty initially)

#### Add Item to Cart
1. Go to **Cart** > **Add Item to Cart**
2. Update body with actual product ID:
   ```json
   {
     "productId": "your-product-id-here",
     "quantity": 2
   }
   ```
3. Click **Send**
4. Returns updated cart with item added

#### Update Cart Item Quantity
1. Go to **Cart** > **Update Cart Item Quantity**
2. Replace `{{productId}}` with actual ID in URL
3. Update body:
   ```json
   {
     "quantity": 5
   }
   ```
4. Click **Send**

#### Remove Item from Cart
1. Go to **Cart** > **Remove Item from Cart**
2. Replace `{{productId}}` with actual ID in URL
3. Click **Send**
4. Item removed from cart

### 7. Test Checkout & Orders

#### Checkout
1. Ensure you have items in cart (complete Step 6 first)
2. Go to **Checkout & Orders** > **Checkout**
3. Click **Send**
4. Returns order confirmation with order ID
5. Cart automatically cleared

#### List Orders
1. Go to **Checkout & Orders** > **List User Orders**
2. Click **Send**
3. Returns all orders for logged-in user

### 8. Test Users (User Management)

#### List All Users
1. Go to **Users** > **List All Users**
2. Click **Send**
3. Returns all users in database

#### Create User
1. Go to **Users** > **Create User**
2. Update body:
   ```json
   {
     "name": "New User",
     "email": "newuser@example.com",
     "password": "Password@123"
   }
   ```
3. Click **Send**

#### Get User by ID
1. Go to **Users** > **Get User By ID**
2. Uses `{{userId}}` from login/register
3. Click **Send**

#### Update User
1. Go to **Users** > **Update User**
2. Update body:
   ```json
   {
     "name": "Updated Name",
     "email": "newemail@example.com"
   }
   ```
3. Click **Send**

#### Delete User
1. Go to **Users** > **Delete User**
2. Click **Send**
3. Returns `204 No Content`

## Complete Testing Scenario

**Recommended order for first-time testing:**

1. ✅ Health Check > Health (verify server is running)
2. ✅ Auth > Login (get accessToken for protected routes)
3. ✅ Products > List All Products (view seeded products)
4. ✅ Products > Get Product By ID (view specific product)
5. ✅ Cart > Get Cart (check empty cart)
6. ✅ Cart > Add Item to Cart (add product)
7. ✅ Cart > Get Cart (verify item added)
8. ✅ Cart > Update Cart Item Quantity (change quantity)
9. ✅ Checkout & Orders > Checkout (place order)
10. ✅ Checkout & Orders > List User Orders (verify order created)
11. ✅ Cart > Get Cart (verify cart is cleared)

## Authentication Notes

### Bearer Token Auto-Population
The collection uses Postman's test scripts to automatically:
1. Extract `accessToken` from login/register responses
2. Save it to `{{accessToken}}` environment variable
3. Auto-apply to all protected endpoints

### Manual Token Usage (if auto-population fails)
1. Copy token from login response
2. Go to **Auth** tab of any protected request
3. Select **Bearer Token** type
4. Paste token in value field

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Make sure you've logged in first and token is set |
| 404 Product Not Found | Use valid product ID from product list |
| 400 Bad Request | Check request body format matches API spec |
| 500 Server Error | Check backend console for error; restart `npm run dev` |
| Connection Refused | Ensure backend is running on port 4000 |

## API Response Examples

### Successful Login (200)
```json
{
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Demo User",
      "email": "demo@example.com",
      "createdAt": "2026-05-07T...",
      "updatedAt": "2026-05-07T..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Cart Response (200)
```json
{
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439013",
        "name": "Wireless Mouse",
        "unitPrice": 799,
        "quantity": 2
      }
    ],
    "total": 1598,
    "createdAt": "2026-05-07T...",
    "updatedAt": "2026-05-07T..."
  }
}
```

### Order Response (201)
```json
{
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "items": [...],
    "total": 1598,
    "status": "placed",
    "createdAt": "2026-05-07T...",
    "updatedAt": "2026-05-07T..."
  }
}
```

## Need Help?

- Check backend logs: `npm run dev` console output
- Verify MongoDB connection: Check MongoDB Compass for `e-comm-app` database
- Test API with curl: `curl http://localhost:4000/api/v1/health`
- Enable Postman Console: View > Show Postman Console (bottom panel)
