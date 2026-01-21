# Fix 404 Errors - Vercel Environment Setup

## Problem
The frontend is deployed on Vercel but getting 404 errors because the `VITE_BACKEND_URL` environment variable is not set. This causes API calls to malformed URLs.

## Solution

### Step 1: Set Environment Variable in Vercel Dashboard
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your frontend project (`hungry-harvest`)
3. Click **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://hungry-harvest-1.onrender.com`
   - **Environment:** Select all (Development, Preview, Production)
5. Click **Save**

### Step 2: Redeploy Your Frontend
1. In Vercel dashboard, go to **Deployments**
2. Click the three dots (...) on the latest deployment
3. Select **Redeploy** or
4. Push a new commit to your GitHub repository to trigger a new deployment

### Step 3: Verify the Fix
- Clear your browser cache (Ctrl+Shift+Delete)
- Visit your Vercel deployment URL
- The API calls should now work correctly

## Why This Happens
- `.env` files are **NOT** committed to Git (added to `.gitignore` for security)
- Vercel doesn't have access to local `.env` files
- Environment variables must be set in Vercel's dashboard or via CLI
- Vite reads these variables at build time (they become embedded in the compiled code)

## Alternative: Use Vercel CLI
```bash
vercel env add VITE_BACKEND_URL
# Enter: https://hungry-harvest-1.onrender.com
vercel redeploy
```

## Also Deploy Admin Panel
Do the same for the admin panel if deployed separately on Vercel.
