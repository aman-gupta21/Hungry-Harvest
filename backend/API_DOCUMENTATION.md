# Food Delivery API - Complete Documentation

## Base URL
```
https://your-backend-domain.com/api
```

## Authentication

JWT token required for protected endpoints. Send token in either:
1. Header: `Authorization: Bearer {token}`
2. Header: `token: {token}`

---

## 📚 User Endpoints

### 1. Register User
Create a new user account.

```http
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (400, 409)**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login User
Authenticate and get JWT token.

```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Get User Profile
Retrieve authenticated user's profile.

```http
GET /user/profile
Authorization: Bearer {token}
```

**Success Response (200)**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4. Update User Profile
Update user name and/or email.

```http
PUT /user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

---

### 5. Change Password
Change user password.

```http
POST /user/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🍔 Food Endpoints

### 1. Get All Foods
List all available food items.

```http
GET /food/list
```

**Success Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Delicious Burger",
      "description": "Fresh beef burger with cheese",
      "price": 8.99,
      "category": "Burgers",
      "image": "https://res.cloudinary.com/..."
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Pepperoni Pizza",
      "description": "Classic pepperoni pizza",
      "price": 12.99,
      "category": "Pizza",
      "image": "https://res.cloudinary.com/..."
    }
  ]
}
```

---

### 2. Add Food Item (Admin)
Create a new food item with image upload.

```http
POST /food/add
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

FormData:
  - name: "Delicious Burger"
  - description: "Fresh beef burger with cheese"
  - price: "8.99"
  - category: "Burgers"
  - image: [binary image data]
```

**Success Response (201)**
```json
{
  "success": true,
  "message": "Food item added successfully",
  "food": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Delicious Burger",
    "description": "Fresh beef burger with cheese",
    "price": 8.99,
    "category": "Burgers",
    "image": "https://res.cloudinary.com/..."
  }
}
```

**Error Response (400)**
```json
{
  "success": false,
  "message": "Name, description, price, and category are required"
}
```

---

### 3. Remove Food Item (Admin)
Delete a food item.

```http
POST /food/remove
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "id": "507f1f77bcf86cd799439012"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Food item removed successfully"
}
```

---

## 🛒 Cart Endpoints

### 1. Add to Cart
Add item to user's cart.

```http
POST /cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "itemId": "507f1f77bcf86cd799439012"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Added to cart",
  "cartData": {
    "507f1f77bcf86cd799439012": 2,
    "507f1f77bcf86cd799439013": 1
  }
}
```

---

### 2. Remove from Cart
Remove/decrement item from cart.

```http
POST /cart/remove
Authorization: Bearer {token}
Content-Type: application/json

{
  "itemId": "507f1f77bcf86cd799439012"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Removed from cart",
  "cartData": {
    "507f1f77bcf86cd799439012": 1,
    "507f1f77bcf86cd799439013": 1
  }
}
```

---

### 3. Get Cart Data
Retrieve user's current cart.

```http
POST /cart/get
Authorization: Bearer {token}
Content-Type: application/json

{}
```

**Success Response (200)**
```json
{
  "success": true,
  "cartData": {
    "507f1f77bcf86cd799439012": 2,
    "507f1f77bcf86cd799439013": 1
  }
}
```

---

## 📦 Order Endpoints

### 1. Place Order
Create a new order and get Stripe checkout session.

```http
POST /order/place
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Burger",
      "price": 8.99,
      "quantity": 2
    }
  ],
  "amount": 20,
  "address": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipcode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  }
}
```

**Success Response (200)**
```json
{
  "success": true,
  "session_url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Error Response (400, 401)**
```json
{
  "success": false,
  "message": "Please log in to place an order"
}
```

---

### 2. Verify Payment
Verify Stripe payment and update order status.

```http
GET /order/verify?orderId=507f1f77bcf86cd799439014&success=true
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Payment verified",
  "order": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "items": [...],
    "amount": 20,
    "status": "Order Confirmed",
    "payment": true,
    "date": "2024-01-15T10:30:00Z"
  }
}
```

**Failed Payment Response (200)**
```json
{
  "success": false,
  "message": "Payment not completed",
  "order": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "Payment Failed",
    "payment": false
  }
}
```

---

### 3. Get User Orders
Retrieve all orders for authenticated user.

```http
POST /order/userorders
Authorization: Bearer {token}
Content-Type: application/json

{}
```

**Success Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "items": [
        {
          "id": "507f1f77bcf86cd799439012",
          "name": "Burger",
          "price": 8.99,
          "quantity": 2
        }
      ],
      "amount": 20,
      "address": {...},
      "status": "Order Confirmed",
      "payment": true,
      "date": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 4. List All Orders (Admin)
Get all orders with optional filtering.

```http
GET /order/list?status=Order%20Confirmed&page=1&limit=20
Authorization: Bearer {admin_token}
```

**Success Response (200)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": {...},
      "items": [...],
      "amount": 20,
      "status": "Order Confirmed",
      "payment": true,
      "date": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

---

### 5. Get Order Details (Admin)
Retrieve a specific order.

```http
GET /order/507f1f77bcf86cd799439014
Authorization: Bearer {admin_token}
```

**Success Response (200)**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "items": [...],
    "amount": 20,
    "address": {...},
    "status": "Order Confirmed",
    "payment": true,
    "date": "2024-01-15T10:30:00Z"
  }
}
```

---

### 6. Update Order (Admin)
Update order status or payment status.

```http
PATCH /order/507f1f77bcf86cd799439014
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "Delivered",
  "payment": true
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Order updated",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "Delivered",
    "payment": true,
    ...
  }
}
```

---

### 7. Real-time Order Stream (SSE)
Subscribe to real-time order updates.

```http
GET /order/stream
```

**Server sends:**
```
event: connected
data: {"ok":true}

event: order
data: {"type":"created","payload":{...},"timestamp":1234567890}

event: order
data: {"type":"updated","payload":{...},"timestamp":1234567891}
```

---

## 🔔 Webhook Endpoint

### Stripe Webhook
Receives payment events from Stripe.

```http
POST /order/webhook
Content-Type: application/json
Stripe-Signature: {signature}

{
  "id": "evt_1234...",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "metadata": {
        "orderId": "507f1f77bcf86cd799439014"
      }
    }
  }
}
```

---

## 🔍 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |

---

## 🗂️ Order Status Values

- `Food Processing` - Initial status
- `Order Confirmed` - Payment confirmed
- `Food Preparing` - Kitchen preparing order
- `Order Ready` - Ready for pickup/delivery
- `Out for Delivery` - Delivery in progress
- `Delivered` - Order completed
- `Payment Failed` - Payment unsuccessful
- `Cancelled` - Order cancelled

---

## 💰 Currency

All amounts are in USD (or your configured currency in Stripe).

---

## 🔐 Admin Routes

Routes requiring admin privileges:
- `POST /food/add` - Add food item
- `POST /food/remove` - Remove food item
- `GET /order/list` - List all orders
- `GET /order/:id` - Get order details
- `PATCH /order/:id` - Update order

Currently determined by JWT token authentication. Implement role-based access control for production.

---

## 📱 Image Upload

When uploading images:
- Format: JPEG, PNG, GIF, WebP
- Max size: 5MB
- Content-Type: multipart/form-data
- Field name: `image`

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "password":"password123"
  }'
```

### List Foods
```bash
curl http://localhost:4000/api/food/list
```

### Place Order
```bash
curl -X POST http://localhost:4000/api/order/place \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "amount": 20,
    "address": {...}
  }'
```

---

## 📞 Error Messages

Common error messages and solutions:

| Error | Solution |
|-------|----------|
| "Email already exists" | Use a different email address |
| "Invalid credentials" | Check email and password |
| "Not Authorized. Login Again" | Missing or invalid token |
| "User not found" | User account doesn't exist |
| "Order not found" | Order ID doesn't exist |
| "Item not in cart" | Item was not added to cart |

---

## ⚡ Rate Limiting

No built-in rate limiting. For production, implement rate limiting to prevent abuse.

---

**API Version: 1.0**
**Last Updated: 2024**
