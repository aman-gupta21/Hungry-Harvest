# Food Delivery App - Backend API

Production-ready Node.js backend for the Food Delivery Application.

## 🚀 Features

- User authentication (JWT)
- Food management (CRUD)
- Shopping cart
- Order management
- Payment integration (Stripe)
- Real-time order updates (Server-Sent Events)
- Image storage (Cloudinary)
- MongoDB database

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Stripe account

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** in `.env`
   - Set MongoDB URI
   - Add JWT secret
   - Add Cloudinary credentials
   - Add Stripe keys

4. **Start development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:4000`

## 🔌 API Endpoints

### Authentication
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update profile (protected)
- `POST /api/user/change-password` - Change password (protected)

### Food Items
- `GET /api/food/list` - Get all foods
- `POST /api/food/add` - Add food (admin, protected)
- `POST /api/food/remove` - Remove food (admin, protected)

### Cart
- `POST /api/cart/add` - Add to cart (protected)
- `POST /api/cart/remove` - Remove from cart (protected)
- `POST /api/cart/get` - Get cart data (protected)

### Orders
- `POST /api/order/place` - Place order (protected)
- `GET /api/order/verify` - Verify payment
- `POST /api/order/userorders` - Get user orders (protected)
- `GET /api/order/list` - List all orders (admin, protected)
- `GET /api/order/:id` - Get order details (protected)
- `PATCH /api/order/:id` - Update order (admin, protected)
- `GET /api/order/stream` - Real-time order updates (SSE)

### Webhooks
- `POST /api/order/webhook` - Stripe webhook

## 🔐 Authentication

All protected endpoints require a JWT token in the header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.example.com/api/user/profile
```

Or use custom header:
```bash
curl -H "token: YOUR_TOKEN" \
  https://api.example.com/api/user/profile
```

## 📝 Request/Response Examples

### Register User
**Request:**
```json
POST /api/user/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Place Order
**Request:**
```json
POST /api/order/place
Authorization: Bearer YOUR_TOKEN
{
  "items": [
    {
      "id": "507f1f77bcf86cd799439011",
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
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipcode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "session_url": "https://checkout.stripe.com/pay/..."
}
```

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js           # MongoDB connection
│   └── cloudinary.js   # Cloudinary setup
├── controllers/
│   ├── userController.js
│   ├── foodController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── webhookController.js
├── models/
│   ├── userModel.js
│   ├── foodModel.js
│   └── orderModel.js
├── routes/
│   ├── userRoute.js
│   ├── foodRoute.js
│   ├── cartRoute.js
│   └── orderRoute.js
├── middleware/
│   ├── auth.js
│   └── uploadMiddleware.js
├── utils/
│   └── orderEvents.js
├── uploads/            # Temporary image storage
├── server.js          # Main server file
├── package.json
├── .env.example
└── .gitignore
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install dependencies
npm install
```

## 🗄️ Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  cartData: Object,
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Food
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String (Cloudinary URL)
}
```

### Order
```javascript
{
  _id: ObjectId,
  userId: String,
  items: Array,
  amount: Number,
  address: Object,
  status: String,
  date: Date,
  payment: Boolean
}
```

## 🔒 Security Best Practices

- Environment variables for secrets (never commit `.env`)
- Password hashing with bcrypt
- JWT token expiration (7 days)
- Input validation on all endpoints
- CORS configuration
- Rate limiting recommended for production
- HTTPS enforced in production
- Secure HTTP headers

## 🚨 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict
- `500` - Server error

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB driver
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cloudinary** - Image storage
- **stripe** - Payment processing
- **multer** - File uploads
- **cors** - CORS handling
- **dotenv** - Environment variables
- **validator** - Input validation

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Render

1. Push code to GitHub
2. Connect to Render.com
3. Set environment variables
4. Deploy!

## 🐛 Troubleshooting

**Cannot connect to MongoDB**
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**Images not uploading**
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Verify image format

**Payment not working**
- Verify Stripe keys are correct
- Check webhook configuration
- Test with Stripe test cards

**CORS errors**
- Verify FRONTEND_URL in `.env`
- Check backend CORS configuration

## 📞 Support

For issues, check:
1. Server logs: `npm run dev`
2. MongoDB Atlas metrics
3. Stripe dashboard
4. Cloudinary dashboard

## 📄 License

ISC

## ✨ Ready for Production!

This backend is production-ready with:
- ✅ Error handling
- ✅ Input validation
- ✅ Security best practices
- ✅ Database optimization
- ✅ Logging
- ✅ Environment configuration
- ✅ CORS setup
- ✅ Payment integration
- ✅ Real-time updates
- ✅ Scalable architecture
