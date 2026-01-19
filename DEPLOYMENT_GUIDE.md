# Food Delivery App - Deployment Guide

This guide helps you deploy the Food Delivery Application to production.

## 🚀 Deployment Platforms Recommended

1. **Backend**: Render.com, Railway.app, Heroku, or AWS
2. **Frontend**: Vercel, Netlify, or GitHub Pages
3. **Database**: MongoDB Atlas
4. **Image Storage**: Cloudinary
5. **Payments**: Stripe

---

## 📋 Prerequisites

Before deploying, ensure you have:

- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Git repository (GitHub)
- Deployment platform account (Render/Heroku/Railway)

---

## 🔧 Step 1: Configure Environment Variables

### Backend (.env file)

Create `.env` file in the `backend` folder with the following variables:

```env
# DATABASE
MongoUri=mongodb+srv://username:password@cluster.mongodb.net/food_delivery

# JWT (generate random secret)
JWT_SECRET=your_random_secret_key_here

# STRIPE KEYS
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# CLOUDINARY
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# FRONTEND URL (for CORS and redirects)
FRONTEND_URL=https://your-frontend-domain.com

# NODE ENVIRONMENT
NODE_ENV=production

# PORT
PORT=4000
```

### Frontend (.env file)

Create `.env` file in the `frontend` folder:

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Admin (.env file)

Create `.env` file in the `admin` folder:

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

---

## 🗄️ Step 2: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address
5. Get connection string:
   - Click "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<password>` and `<dbname>` with your values

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/food_delivery
```

---

## ☁️ Step 3: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Get your credentials:
   - Cloud Name
   - API Key
   - API Secret

Add these to your `.env` file.

---

## 💳 Step 4: Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys:
   - Publishable Key (pk_live_...)
   - Secret Key (sk_live_...)
3. Set up webhook:
   - Go to Webhooks → Add Endpoint
   - URL: `https://your-backend-domain.com/api/order/webhook`
   - Events: `checkout.session.completed`
   - Copy Webhook Secret

Add these to your `.env` file.

---

## 📦 Step 5: Deploy Backend

### Option A: Deploy to Render.com

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all from `.env`
6. Deploy!

### Option B: Deploy to Railway.app

1. Go to [Railway.app](https://railway.app)
2. New Project → GitHub Repo
3. Configure environment variables
4. Deploy!

### Option C: Deploy to Heroku (Legacy)

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
heroku config:set VAR_NAME=value
```

---

## 🌐 Step 6: Deploy Frontend

### Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import project
4. Configure environment variables:
   - `VITE_BACKEND_URL=https://your-backend-domain.com`
5. Deploy!

### Deploy to Netlify

1. Go to [Netlify.com](https://netlify.com)
2. New site from Git
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables
4. Deploy!

---

## 🎨 Step 7: Deploy Admin Dashboard

Same process as frontend:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_BACKEND_URL`

---

## ✅ Testing Deployment

1. **Test Backend**:
   ```
   GET https://your-backend-domain.com/
   ```
   Should return: `API working`

2. **Test Database Connection**:
   - Create user account on frontend
   - Check MongoDB Atlas → Collections

3. **Test Image Upload**:
   - Add food item in admin panel
   - Verify image appears

4. **Test Payments**:
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete purchase flow

---

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit real API keys
- [ ] Enable HTTPS on all domains
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for your frontend
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable MongoDB IP whitelist
- [ ] Set up Stripe webhook secret

---

## 📝 Environment Variables Summary

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MongoUri` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random 32+ char string |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `CLOUDINARY_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `secret_key` |
| `FRONTEND_URL` | Frontend domain for CORS | `https://frontend.com` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `4000` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `https://backend.com` |

---

## 🐛 Troubleshooting

### Backend won't start
- Check all environment variables are set
- Verify MongoDB connection string
- Check logs: `heroku logs --tail`

### Images not uploading
- Verify Cloudinary credentials
- Check file size < 5MB
- Verify image format (jpeg, png, gif, webp)

### Payment not working
- Verify Stripe keys are correct
- Check webhook is configured
- Test with Stripe test cards

### CORS errors
- Verify `FRONTEND_URL` matches your domain
- Check backend CORS configuration
- Ensure frontend and backend are different domains

### Database errors
- Verify MongoDB URI is correct
- Whitelist backend IP in MongoDB Atlas
- Check database has required collections

---

## 📞 Support

For issues, check:
1. Backend logs (Render/Railway dashboard)
2. Frontend console (Browser DevTools)
3. MongoDB Atlas metrics
4. Stripe dashboard for payment issues

---

## ✨ Final Steps

1. Test complete order flow
2. Test admin dashboard
3. Monitor error logs
4. Set up monitoring/alerts
5. Regular backups

**Congratulations! Your Food Delivery App is now live! 🎉**
