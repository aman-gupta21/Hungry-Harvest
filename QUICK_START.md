# Quick Start - Deployment Ready Backend

Get your Food Delivery App backend deployed in 15 minutes!

## 🎯 5-Step Deployment

### Step 1: Prepare Your Environment (2 min)

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:
```env
MongoUri=your_mongodb_uri
JWT_SECRET=your_random_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend.com
NODE_ENV=production
```

### Step 2: Get Your Credentials (5 min)

Quick links to get credentials:

1. **MongoDB Atlas**
   - https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string

2. **Cloudinary**
   - https://cloudinary.com/
   - Get Cloud Name, API Key, API Secret

3. **Stripe**
   - https://dashboard.stripe.com/
   - Use production keys (sk_live_...)
   - Get webhook secret

### Step 3: Test Locally (3 min)

```bash
npm install
npm run dev
```

Test endpoints:
```bash
curl http://localhost:4000/
# Should return: API working
```

### Step 4: Deploy to Render (3 min)

1. Push to GitHub:
```bash
git add .
git commit -m "Deploy backend"
git push origin main
```

2. On Render.com:
   - Click "New Web Service"
   - Connect GitHub repo
   - Select `backend` folder
   - Build: `npm install`
   - Start: `npm start`
   - Add environment variables
   - Deploy!

3. Copy your backend URL from Render dashboard

### Step 5: Update Frontend (2 min)

In `frontend/.env`:
```env
VITE_BACKEND_URL=https://your-render-app.onrender.com
```

In `admin/.env`:
```env
VITE_BACKEND_URL=https://your-render-app.onrender.com
```

Deploy frontend to Vercel or Netlify.

---

## ✅ Verify Deployment

After deploying, test these endpoints:

```bash
# 1. Health check
curl https://your-backend.onrender.com/

# 2. Get foods
curl https://your-backend.onrender.com/api/food/list

# 3. Test backend connection in frontend
# Create account on frontend
# Check if MongoDB shows new user

# 4. Test payment
# Place order with Stripe test card: 4242 4242 4242 4242
```

---

## 🚀 You're Live!

Your app is now deployed! Users can:
- Register & login
- Browse food items
- Add to cart
- Place orders with Stripe
- Track order status

---

## 📊 Monitoring

After deployment:

```bash
# Check server logs
# Render dashboard → Logs

# Monitor database
# MongoDB Atlas → Metrics

# Monitor payments
# Stripe Dashboard → Payments

# Monitor errors
# Check email for alerts
```

---

## 🔧 Common Issues

### "Cannot connect to database"
→ Check MongoDB IP whitelist in Atlas

### "Images not uploading"
→ Verify Cloudinary credentials

### "Payment not working"
→ Check Stripe keys are production keys (not test)

### "CORS error on frontend"
→ Update FRONTEND_URL in backend .env

---

## 📱 Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm start

# Check logs (Render)
heroku logs --tail

# See what's deployed
curl https://your-backend.onrender.com/api/food/list
```

---

## 💡 Pro Tips

1. **Backup your database regularly**
   - MongoDB Atlas → Backup & Restore

2. **Monitor costs**
   - Stripe → Payments
   - Cloudinary → Storage
   - Render → Usage

3. **Update dependencies**
   - Regularly: `npm audit`
   - Don't forget security updates

4. **Enable backups**
   - MongoDB Atlas: Enable automated backups
   - Code: Use GitHub as backup

5. **Set up alerts**
   - Render: Enable notifications
   - Stripe: Enable email notifications

---

## 🆘 Need Help?

Check these first:
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed guide
2. [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) - API reference
3. [backend/README.md](./backend/README.md) - Backend info
4. [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-launch

---

## 🎉 Congrats!

Your Food Delivery App is live in production! 

Next steps:
- [ ] Share with users
- [ ] Monitor logs daily
- [ ] Add more food items
- [ ] Gather user feedback
- [ ] Optimize based on usage

**Happy coding! 🚀**
