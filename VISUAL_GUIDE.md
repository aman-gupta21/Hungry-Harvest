# 🎯 ADMIN JWT TOKEN SYSTEM - VISUAL GUIDE

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USERS & ADMINS                             │
│                                                                     │
│  👤 Regular User         🔐 Admin User                              │
│  role: "user"            role: "admin"                              │
└────┬────────────────────────────────────┬──────────────────────────┘
     │                                    │
     └────────────────┬───────────────────┘
                      ↓
        ┌─────────────────────────────┐
        │    FRONTEND APP             │
        │  (React/Vite - Port 5174)   │
        │                             │
        │  • Food browsing            │
        │  • Shopping cart            │
        │  • Order placement          │
        │  • User authentication      │
        │  • User profile             │
        └────────────┬────────────────┘
                     │
                     │ (1) User Registers/Logs In
                     │ (2) Backend returns token
                     │ (3) Frontend stores:
                     │     - localStorage.token
                     │     - localStorage.user
                     │
                     ↓
        ┌─────────────────────────────┐
        │    BACKEND API              │
        │  (Node.js - Port 4000)      │
        │                             │
        │  • User Management          │
        │  • Food CRUD                │
        │  • Cart Operations          │
        │  • Order Processing         │
        │  • Payment Verification     │
        │  • Real-time Updates (SSE)  │
        └────────────┬────────────────┘
                     │
                     │ (4) Returns JWT Token
                     │     + User Info (role)
                     │
                     ↓
        ┌─────────────────────────────┐
        │    DATABASE                 │
        │  (MongoDB)                  │
        │                             │
        │  Collections:               │
        │  • Users (with roles)       │
        │  • Foods (items)            │
        │  • Orders (with status)     │
        │  • Carts                    │
        └─────────────────────────────┘


┌────────────────────────────────────────────────────────────────────┐
│           ↓ Regular User Continues ↓                               │
│                                                                    │
│  Frontend stays the same - user browses food and places orders     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────┐
│           ↓ Admin User Gets Extra Access ↓                         │
│                                                                    │
│  Admin reads localStorage.token and localStorage.user              │
│                          ↓                                         │
│        Can admin panel access it?                                  │
│        Is role === "admin"?                                        │
│                          ↓                                         │
│               YES         NO                                       │
│                ↓          ↓                                        │
│            SHOW       SHOW LOGIN                                   │
│          DASHBOARD     PAGE                                        │
│                                                                    │
│  Admin Features:        Regular User:                              │
│  ✓ Add Food            ✗ Can't add food                            │
│  ✓ Remove Food         ✗ Can't remove food                         │
│  ✓ Manage Orders       ✗ Can't see all orders                      │
│  ✓ Update Status       ✗ Can only see own orders                   │
│  ✓ View Dashboard      ✗ Only sees homepage                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌──────────────────────┐
                    │    ADMIN PANEL       │
                    │  (React/Vite         │
                    │   Port 5173)         │
                    │                      │
                    │  ✨ Features:        │
                    │  • Food Management   │
                    │  • Order Management  │
                    │  • Real-time Updates │
                    │  • Admin Dashboard   │
                    │  • User Info Display │
                    │  • Logout Button     │
                    └──────────────────────┘
```

---

## 📊 Data Flow Diagram

### Login Process
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. User fills login form (Email + Password)                   │
│     ↓                                                            │
│  2. Frontend sends POST /api/user/login                         │
│     ↓                                                            │
│  3. Backend validates credentials                              │
│     ├─ User found?                                              │
│     ├─ Password matches?                                        │
│     ├─ Is active?                                               │
│     ↓                                                            │
│  4. Backend generates JWT token                                │
│     ├─ Payload: { id: userId }                                  │
│     ├─ Secret: process.env.JWT_SECRET                           │
│     ├─ Expiry: 7 days                                           │
│     ↓                                                            │
│  5. Backend returns:                                            │
│     {                                                            │
│       success: true,                                            │
│       token: "eyJhbGc...",                                      │
│       user: {                                                    │
│         id: "507f...",                                          │
│         name: "John",                                           │
│         email: "john@admin.com",                                │
│         role: "admin"  ← IMPORTANT!                             │
│       }                                                          │
│     }                                                            │
│     ↓                                                            │
│  6. Frontend stores in localStorage:                            │
│     localStorage.token = "eyJhbGc..."                           │
│     localStorage.user = JSON.stringify({...})                   │
│     ↓                                                            │
│  7. Frontend logic:                                             │
│     if (user.role === "admin") {                                │
│       // Can access admin panel                                 │
│     } else {                                                     │
│       // Regular user - no admin access                         │
│     }                                                            │
│     ↓                                                            │
│  8. Admin panel reads from same localStorage                    │
│     token = localStorage.token                                  │
│     user = JSON.parse(localStorage.user)                        │
│     ↓                                                            │
│  9. Admin panel checks role                                     │
│     if (user.role === "admin") {                                │
│       // Show dashboard                                         │
│     } else {                                                     │
│       // Show login page                                        │
│     }                                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Token Structure

```
┌──────────────────────────────────────────────────────────────┐
│               JWT TOKEN FORMAT                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Header.Payload.Signature                                   │
│                                                              │
│  Header:                                                    │
│  {                                                          │
│    "alg": "HS256",                                          │
│    "typ": "JWT"                                             │
│  }                                                          │
│                                                              │
│  Payload:                                                   │
│  {                                                          │
│    "id": "507f1f77bcf86cd799439011",  ← User ID            │
│    "iat": 1705688400,                  ← Created at        │
│    "exp": 1706293200                   ← Expires at (7d)   │
│  }                                                          │
│                                                              │
│  Signature:                                                 │
│  HMACSHA256(                                                │
│    base64UrlEncode(header) + "." +                          │
│    base64UrlEncode(payload),                                │
│    process.env.JWT_SECRET                                   │
│  )                                                          │
│                                                              │
│  Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 API Request/Response Cycle

```
┌─────────────────────────────────────────────────────────────┐
│           ADMIN WANTS TO ADD FOOD ITEM                      │
└─────────────────────────────────────────────────────────────┘

1. FRONTEND (Admin Panel)
   └─ Reads: localStorage.token = "eyJhbGc..."
   └─ Creates axios request:
      
      POST /api/food/add
      Headers: {
        Authorization: "Bearer eyJhbGc...",
        Content-Type: multipart/form-data
      }
      Body: {
        name: "Pizza",
        price: 300,
        category: "Rolls",
        description: "Delicious",
        image: <File>
      }

                            ↓↓↓

2. BACKEND (Express Server)
   └─ Receives request
   └─ Middleware: authMiddleware
      ├─ Extracts token from Authorization header
      ├─ Verifies token using JWT_SECRET
      ├─ If valid: Sets req.userId
      ├─ If invalid: Returns 401 Unauthorized
      └─ Continues to controller
   
   └─ Controller: foodController.addFood
      ├─ Gets userId from req.userId
      ├─ Queries database: user role check
      ├─ If role !== "admin": Returns 403 Forbidden
      ├─ If role === "admin": Continues
      ├─ Uploads image to Cloudinary
      ├─ Creates food document in MongoDB
      └─ Returns success response

                            ↓↓↓

3. RESPONSE
   Backend returns:
   {
     success: true,
     message: "Food added successfully",
     data: {
       _id: "507f...",
       name: "Pizza",
       price: 300,
       image: "https://cloudinary.com/...",
       category: "Rolls"
     }
   }

                            ↓↓↓

4. FRONTEND
   └─ Receives response
   └─ Shows success toast
   └─ Refreshes food list
   └─ User sees new food in admin panel
```

---

## 🔑 localStorage Structure

```
┌────────────────────────────────────────────────┐
│           BROWSER LOCAL STORAGE                │
├────────────────────────────────────────────────┤
│                                                │
│  Key: "token"                                  │
│  Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9│
│          .eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQz  │
│          .aBcDeF..."                           │
│                                                │
│  ───────────────────────────────────────────  │
│                                                │
│  Key: "user"                                   │
│  Value: {                                      │
│    "id": "507f1f77bcf86cd799439011",          │
│    "name": "John Manager",                     │
│    "email": "john@admin.com",                  │
│    "role": "admin"  ← ROLE FIELD              │
│  }                                             │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  How it's used:                                │
│                                                │
│  Frontend:                                     │
│  ├─ localStorage.getItem('token')              │
│  └─ axios.defaults.headers.common[             │
│      'Authorization'                           │
│    ] = `Bearer ${token}`                       │
│                                                │
│  Admin Panel:                                  │
│  ├─ const token = localStorage.token           │
│  ├─ const user = JSON.parse(                   │
│  │                 localStorage.user)          │
│  └─ if (user.role === "admin") { ... }         │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🧠 Decision Tree

```
USER OPENS BROWSER
        │
        ├─ Frontend Page (localhost:5174)
        │   ├─ localStorage.token exists?
        │   │   ├─ NO → Show login page
        │   │   └─ YES → Show food items
        │   │
        │   └─ User wants to access admin
        │       └─ Go to Admin Panel
        │
        └─ Admin Panel Page (localhost:5173)
            ├─ localStorage.token exists?
            │   ├─ NO → Show admin login
            │   └─ YES → Check role
            │
            ├─ localStorage.user.role?
            │   ├─ "user" → Show login (blocked)
            │   ├─ "admin" → Show dashboard ✓
            │   └─ undefined → Show login
            │
            └─ Role is "admin"?
                ├─ YES → Grant access to:
                │   ├─ /add - Add food
                │   ├─ /list - View & remove foods
                │   └─ /orders - Manage orders
                │
                └─ NO → Redirect to login
```

---

## 📈 Scaling Architecture

```
PHASE 1: Local Development
┌──────────────────────────────────┐
│ Frontend: localhost:5174          │
│ Admin: localhost:5173             │
│ Backend: localhost:4000           │
│ Database: Local MongoDB           │
└──────────────────────────────────┘

PHASE 2: Staging
┌──────────────────────────────────┐
│ Frontend: staging.app.com         │
│ Admin: admin-staging.app.com      │
│ Backend: api-staging.app.com      │
│ Database: MongoDB Atlas (staging) │
└──────────────────────────────────┘

PHASE 3: Production
┌────────────────────────────────────┐
│ Frontend: app.com (CDN/Vercel)     │
│ Admin: admin.app.com (CDN/Vercel)  │
│ Backend: api.app.com (Scaled)      │
│ Database: MongoDB Atlas (prod)     │
│ Load Balancer: Nginx/HAProxy       │
│ Cache: Redis                       │
│ Images: Cloudinary (auto-scaling)  │
│ Monitoring: Sentry/DataDog         │
└────────────────────────────────────┘
```

---

## 🔄 Token Validation Flow

```
Admin Panel Loads
        │
        ↓
Read localStorage.token
        │
        ↓ (Pass to backend)
        
Backend: GET /api/user/test
Header: Authorization: Bearer {token}
        │
        ↓
JWT Middleware validates
        │
        ├─ Signature valid? ─────NO─→ Return 401
        ├─ Not expired? ──────NO─→ Return 401
        └─ Token format OK? ──NO─→ Return 401
        │
        ↓ (All checks pass)
        
Controller: getUserProfile
        │
        ├─ Find user by ID
        ├─ Get role field
        ├─ Return user data
        │
        ↓
        
Admin Panel receives:
{
  success: true,
  user: {
    id: "507f...",
    name: "John",
    email: "john@admin.com",
    role: "admin"
  }
}
        │
        ↓
Admin Panel checks: role === "admin"?
        │
        ├─ YES → Show dashboard
        └─ NO → Show login page
```

---

## 🎯 API Endpoints Map

```
┌─────────────────────────────────────────────────────────┐
│                   PUBLIC ENDPOINTS                      │
├─────────────────────────────────────────────────────────┤
│ POST   /api/user/login        - User login              │
│ POST   /api/user/register     - User registration       │
│ GET    /api/food/list         - Get all foods           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          AUTHENTICATED ENDPOINTS (All users)             │
├─────────────────────────────────────────────────────────┤
│ GET    /api/user/test         - Validate token          │
│ GET    /api/user/profile      - Get user profile        │
│ PUT    /api/user/profile      - Update profile          │
│ POST   /api/user/change-pwd   - Change password         │
│ POST   /api/cart/add          - Add to cart             │
│ POST   /api/cart/remove       - Remove from cart        │
│ GET    /api/cart/get          - Get cart items          │
│ POST   /api/order/place       - Place order             │
│ POST   /api/order/verify      - Verify payment          │
│ POST   /api/order/user-orders - Get user's orders       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          ADMIN-ONLY ENDPOINTS (role: admin)             │
├─────────────────────────────────────────────────────────┤
│ POST   /api/food/add          - Add food item           │
│ POST   /api/food/remove       - Remove food item        │
│ POST   /api/user/promote-admin - Promote user to admin  │
│ GET    /api/order/list        - Get all orders          │
│ POST   /api/order/status      - Update order status     │
│ GET    /api/order/stream      - Real-time updates (SSE) │
└─────────────────────────────────────────────────────────┘
```

---

**This visual guide helps understand the complete flow of your admin JWT token system!** 🎨
