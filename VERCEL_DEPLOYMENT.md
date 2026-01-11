# Vercel Deployment Guide

## 🚨 Current Issue
The frontend is deployed on Vercel but can't connect to the backend because:
- Backend is still running on `localhost:5000` (local machine only)
- Frontend needs to know where the backend API is located

## ✅ Solution: Deploy Backend + Set Environment Variable

### Option 1: Deploy Backend to Railway (Recommended - Easy & Free)

1. **Sign up at Railway**: https://railway.app
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Configure settings**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables**:
   - `PORT` = `5000` (or let Railway assign)
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB connection string (MongoDB Atlas recommended)
   - `JWT_SECRET` = Your secret key (generate a strong random string)
   - `FRONTEND_URL` = Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
6. **Deploy** - Railway will give you a URL like: `https://your-backend.up.railway.app`

### Option 2: Deploy Backend to Render (Free Tier Available)

1. **Sign up at Render**: https://render.com
2. **Create New Web Service** → Connect your GitHub repo
3. **Settings**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
4. **Add Environment Variables** (same as Railway)
5. **Deploy** - Get URL like: `https://your-backend.onrender.com`

### Option 3: Use MongoDB Atlas (Cloud Database - Required for Production)

**Important**: You need MongoDB Atlas for production (local MongoDB won't work on cloud services)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for all IPs, or specific)
6. Get connection string
7. Use in backend environment variables

---

## 🔧 Step 2: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend URL + `/api` 
     - Example: `https://your-backend.up.railway.app/api`
     - Or: `https://your-backend.onrender.com/api`
4. Select **All Environments** (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your Vercel app (or wait for next auto-deploy)

---

## 📝 Quick Setup Summary

### Backend Environment Variables (Railway/Render):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phonepe_portal
JWT_SECRET=your_very_long_random_secret_key_here
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend Environment Variable (Vercel):
```env
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

---

## 🧪 Test After Deployment

1. Visit your Vercel frontend URL
2. Try to login
3. Check browser console for errors
4. If errors, verify:
   - Backend URL is correct
   - Backend is running (check Railway/Render dashboard)
   - MongoDB connection is working
   - Environment variables are set correctly

---

## 💡 Quick Test Commands

Test backend is running:
```bash
curl https://your-backend.up.railway.app/api/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```
