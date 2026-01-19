# 🍔 Food Delivery App - Admin Setup Guide

## Overview
The admin panel now uses the **same JWT token** as the frontend. This means:
- **Everyone uses ONE frontend** for login
- **Admins access the admin panel** with their admin credentials
- **Token is shared** between frontend and admin portal
- **Role-based access control** prevents unauthorized access

---

## 🎯 How to Use

### 1. **Create an Admin Account**

First, you need an admin user. There are two ways:

#### Option A: Create via Frontend + Promote
```bash
# 1. Register a regular user in the frontend
# 2. Promote them to admin (needs backend database update or API call)

curl -X POST http://localhost:4000/api/user/promote-admin \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Option B: Create Admin Directly in Database
```javascript
// In MongoDB
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "<bcrypt_hashed_password>",
  role: "admin"  // This is the key!
})
```

---

### 2. **Admin Login Flow**

#### Step 1: Login via Frontend (http://localhost:5174)
- Click "Sign up" or "Login"
- Enter admin email and password
- On successful login:
  - Token is stored in `localStorage.token`
  - User info is stored in `localStorage.user`
  - Token includes role: `{ role: "admin" }`

#### Step 2: Access Admin Panel (http://localhost:3000)
- Admin panel automatically checks `localStorage.token`
- If valid admin token exists → Shows dashboard
- If not admin → Shows login page
- If no token → Redirects to login

---

## 📁 Token Storage Structure

```javascript
// Frontend & Admin Panel use the SAME keys:

// Token storage
localStorage.token = "eyJhbGc..."

// User info storage
localStorage.user = {
  id: "507f1f77bcf86cd799439011",
  name: "Admin Name",
  email: "admin@example.com",
  role: "admin"  // This is what admin panel checks!
}
```

---

## 🔐 Admin Functions

Once logged in as admin, you can:

### 1. **Add Food Items** (`/add`)
- Upload food image
- Enter name, description, price
- Select category
- System adds to Cloudinary & MongoDB

### 2. **View & Remove Foods** (`/list`)
- See all food items
- Delete foods with ❌ button
- Requires valid admin token

### 3. **Manage Orders** (`/orders`)
- View all customer orders
- Update order status (Pending → Processing → Out for Delivery → Delivered)
- Real-time SSE updates
- Pagination support (20 items per page)
- Filter by status

### 4. **Logout**
- Click logout button in navbar
- Clears `localStorage.token` and `localStorage.user`
- Redirects to login

---

## 🚀 Startup Commands

```bash
# Terminal 1: Start Backend
cd backend
npm install
node server.js
# Output: 🚀 Server running on port 4000

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
# Output: Local: http://localhost:5174

# Terminal 3: Start Admin Panel
cd adimin
npm install
npm run dev
# Output: Local: http://localhost:5173 (or 5174/5175)
```

---

## 🔗 All Services

| Service | URL | Port | Type |
|---------|-----|------|------|
| Backend API | http://localhost:4000 | 4000 | Node.js/Express |
| Frontend | http://localhost:5174 | 5174 | React/Vite |
| Admin Panel | http://localhost:5173/5175/3000 | Variable | React/Vite |
| MongoDB | local/Atlas | - | Database |

---

## 📱 User Flow

```
1. Customer/Admin visits frontend (http://localhost:5174)
   ↓
2. Clicks Login/Sign up
   ↓
3. Enters credentials
   ↓
4. Backend validates and returns token + user info
   ↓
5. Frontend stores in localStorage
   ↓
6. If admin → Can also access admin panel
   ↓
7. Admin panel reads same token from localStorage
   ↓
8. Admin panel validates token via /api/user/test
   ↓
9. If valid admin → Shows dashboard
   ↓
10. Admin manages food, orders, etc.
```

---

## 🔑 Authentication Headers

Both frontend and admin panel send:

```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

Backend middleware validates this token:
```javascript
// backend/middleware/auth.js
const token = req.headers.authorization?.split(" ")[1]
const decoded = jwt.verify(token, process.env.JWT_SECRET)
req.userId = decoded.id
```

---

## ⚠️ Important Notes

1. **Admin Role Check**
   - Admin panel only works if `user.role === "admin"`
   - Regular users cannot access admin features

2. **Token Expiry**
   - Tokens expire after 7 days
   - User needs to login again

3. **Single Session**
   - Token stored in localStorage
   - Works across browser tabs/windows

4. **Logout**
   - Only removes localStorage (frontend forgets token)
   - Token is still valid on backend until expiry
   - For security, implement token blacklist in production

---

## 🧪 Testing the Admin Flow

### Test 1: Admin Login
```bash
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Test 2: Validate Token
```bash
curl -X GET http://localhost:4000/api/user/test \
  -H "Authorization: Bearer eyJhbGc..."

# Response:
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": "...",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Test 3: Add Food (Admin Only)
```bash
curl -X POST http://localhost:4000/api/food/add \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "name=Pizza" \
  -F "price=300" \
  -F "category=Rolls" \
  -F "description=Delicious" \
  -F "image=@image.jpg"
```

---

## 🎨 UI Improvements Made

- ✅ Admin navbar shows logged-in user name and role
- ✅ Logout button with confirmation
- ✅ Beautiful login page with gradient
- ✅ Auto-redirect to login if not authenticated
- ✅ Loading states during requests
- ✅ Error messages from backend
- ✅ Real-time order updates via SSE

---

## 📝 Summary

✅ **Single JWT Token** - Shared across frontend and admin panel
✅ **Same Login** - Use frontend to login, automatically works in admin
✅ **Role-Based** - Only admins can access admin dashboard
✅ **Secure** - JWT validation on every request
✅ **Persistent** - Token stored in localStorage across sessions

Now you can deploy this to production with everyone using one frontend! 🚀
