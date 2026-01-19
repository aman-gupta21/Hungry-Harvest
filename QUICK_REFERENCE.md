# 🚀 Quick Reference - Admin JWT Token System

## TL;DR (Too Long; Didn't Read)

✅ **One frontend for everyone**
✅ **Same JWT token for users and admins**
✅ **Admin access based on role ("admin")**
✅ **No separate admin login needed**

---

## 🔑 Key Concepts

### Token Storage
```javascript
localStorage.token        // JWT token
localStorage.user        // { id, name, email, role }
```

### Admin Check
```javascript
if (user.role === "admin") {
  // Show admin dashboard
} else {
  // Show login
}
```

### API Header
```javascript
headers: {
  Authorization: `Bearer ${localStorage.token}`
}
```

---

## 🎬 User Flows

### Regular User
```
1. Frontend: Register/Login
2. Backend: Returns token
3. Frontend: Can browse food, place order
4. Admin Panel: Shows login (not admin role)
```

### Admin User
```
1. Frontend: Login with admin account
2. Backend: Returns token + role="admin"
3. Frontend: Can browse food, place order
4. Admin Panel: Shows dashboard (admin role)
5. Admin: Add/remove food, manage orders
```

---

## 📂 Directory Structure

```
food-del/
├── backend/
│   ├── create-admin.js        ← Create admin user
│   ├── server.js              ← Start backend
│   ├── routes/
│   │   └── userRoute.js       ← Has /api/user/test endpoint
│   └── ...
├── frontend/
│   ├── src/
│   │   └── components/
│   │       └── LoginPopUp/
│   │           └── LoginPopUp.jsx  ← Stores user info
│   └── .env
├── adimin/
│   ├── src/
│   │   ├── App.jsx            ← Authentication check
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   │   └── Login.jsx   ← Admin login page
│   │   │   ├── Add/
│   │   │   ├── List/
│   │   │   └── Orders/
│   │   └── components/
│   │       └── Sidebar/
│   │           └── Navbar.jsx  ← Shows user + logout
│   └── .env
├── ADMIN_SETUP.md             ← Detailed setup
├── DEPLOYMENT.md              ← Production guide
└── CHANGES_SUMMARY.md         ← All changes made
```

---

## ⚡ Quick Commands

### Setup
```bash
# Backend
cd backend && npm install && node create-admin.js

# Frontend
cd frontend && npm install

# Admin Panel
cd adimin && npm install
```

### Start
```bash
# Terminal 1
cd backend && node server.js

# Terminal 2
cd frontend && npm run dev

# Terminal 3
cd adimin && npm run dev
```

### URLs
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5174`
- Admin: `http://localhost:5173` (or 5175)

---

## 🔐 Login Instructions

1. Go to `http://localhost:5174` (frontend)
2. Click "Sign up" or "Login"
3. Enter admin email and password
4. Click Login
5. In same browser, go to `http://localhost:5173` (admin)
6. You're automatically logged in! 🎉

---

## 🛠️ Create Admin User

```bash
cd backend
node create-admin.js

# Then follow prompts:
# Admin Name: [Your Name]
# Admin Email: admin@example.com
# Admin Password: [Strong Password]
# Confirm Password: [Same Password]
```

---

## 📡 API Endpoints Used

### Shared (Frontend & Admin)
- `POST /api/user/login` - Login user
- `POST /api/user/register` - Register user
- `GET /api/user/test` - Validate token

### Admin Only (Protected)
- `POST /api/food/add` - Add food
- `POST /api/food/remove` - Remove food
- `GET /api/order/list` - Get all orders
- `POST /api/order/status` - Update order status
- `GET /api/order/stream` - Real-time updates (SSE)

---

## 🧪 Test Admin Flow

### Step 1: Create Admin
```bash
cd backend
node create-admin.js
# Email: test@admin.com, Password: Test123456
```

### Step 2: Login via Frontend
```
http://localhost:5174 → Login → Enter credentials → Success
```

### Step 3: Access Admin
```
http://localhost:5173 → Should see dashboard
```

### Step 4: Test Functions
- Add Food: Go to /add page
- List Foods: Go to /list page
- Manage Orders: Go to /orders page
- Logout: Click logout button

---

## 🐛 Troubleshooting

### "Admin panel shows login"
✓ Make sure you logged in through frontend first
✓ Check: `localStorage.getItem('token')` in console
✓ Check: `localStorage.getItem('user')` - should have `role: "admin"`

### "Login fails"
✓ Make sure backend is running (port 4000)
✓ Check: `http://localhost:4000/api/food/list` works
✓ Verify credentials are correct

### "Can't add food"
✓ Make sure you're logged in as admin
✓ Check user role in localStorage
✓ Verify auth headers are sent

### "Images not showing"
✓ Make sure Cloudinary URL is being returned
✓ Check image file was uploaded successfully
✓ Verify Cloudinary credentials are set

---

## 🔄 Token Flow Diagram

```
USER REGISTRATION
     ↓
USER LOGIN (Frontend)
     ↓
Backend: Generate JWT token
     ↓
Return: token + user { id, name, email, role }
     ↓
Frontend: Store in localStorage
     ↓
Check: user.role === "admin"?
     ↓ YES              ↓ NO
Admin Panel         Regular User
Can access          Can only use
/add, /list,        food & order
/orders             pages

     ↓ (Any API call)
Include header: Authorization: Bearer {token}
     ↓
Backend: Validate token + check role
     ↓
Access granted or denied
```

---

## 📝 Files You'll Edit

**Most Common:**
- `backend/create-admin.js` - To create admin users
- `adimin/src/pages/Add/Add.jsx` - To modify add food form
- `adimin/src/pages/List/List.jsx` - To modify food list
- `adimin/src/pages/Orders/Orders.jsx` - To modify order management

**Rarely:**
- `backend/server.js` - Server configuration
- `frontend/src/App.jsx` - Frontend layout
- `adimin/src/App.jsx` - Admin layout

---

## 🚨 Important Notes

1. **JWT Token Expiry**: 7 days
   - After 7 days, user must login again

2. **Role Check**: On admin panel load
   - If not admin role → Shows login page
   - If admin role → Shows dashboard

3. **Logout**: Clears localStorage
   - Deletes token
   - Deletes user info
   - Redirects to login

4. **Same Token**: Frontend and Admin use same token
   - No confusion about which token to use
   - Simpler deployment

---

## ✅ Deployment Checklist

- [ ] Backend deployed to production server
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Admin panel deployed (same or different domain)
- [ ] `.env` files updated with production URLs
- [ ] MongoDB Atlas configured
- [ ] Cloudinary credentials set
- [ ] Stripe keys configured
- [ ] Admin user created in production database
- [ ] SSL/HTTPS enabled
- [ ] Tested complete login flow
- [ ] Tested admin functions
- [ ] Error logs monitored

---

## 🎯 Next Steps

1. **Local Testing**
   - Create admin user
   - Test login flow
   - Test all admin functions

2. **Production Setup**
   - Deploy backend
   - Deploy frontend
   - Deploy admin panel
   - Configure domains
   - Update environment variables

3. **Go Live**
   - Test production deployment
   - Monitor logs
   - Get user feedback

---

**Questions?** See detailed guides:
- Setup: `ADMIN_SETUP.md`
- Deployment: `DEPLOYMENT.md`
- Changes: `CHANGES_SUMMARY.md`

**Good luck! 🚀**
