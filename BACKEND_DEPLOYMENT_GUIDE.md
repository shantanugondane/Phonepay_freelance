# Backend Deployment Guide - Step by Step

This guide will help you deploy your backend to Railway (free tier available) and set up MongoDB Atlas (free cloud database).

---

## Part 1: Set Up MongoDB Atlas (Cloud Database) ⚠️ REQUIRED

You **must** use MongoDB Atlas for production. Local MongoDB won't work on cloud services.

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with your email (Google sign-in works too)
4. Verify your email if prompted

### Step 2: Create a Free Cluster

1. After login, you'll see "Deploy a cloud database"
2. Select **"M0 FREE"** (Free forever tier)
3. Choose a cloud provider (AWS is recommended)
4. Choose a region closest to you (e.g., `N. Virginia (us-east-1)` for US, `Mumbai (ap-south-1)` for India)
5. Click **"Create"** (it may take 2-3 minutes to create)

### Step 3: Create Database User

1. While cluster is creating, you'll see "Create Database User"
2. Choose **"Password"** authentication
3. Enter a username (e.g., `phonepe_admin`)
4. Click **"Autogenerate Secure Password"** (SAVE THIS PASSWORD - you'll need it!)
5. Click **"Create User"**

### Step 4: Set Network Access (Allow Connections)

1. Click **"Add My Current IP Address"** (adds your current IP)
2. **IMPORTANT:** Also click **"Add Entry"** and enter `0.0.0.0/0` (allows connections from anywhere - needed for Railway)
3. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Once cluster is created, click **"Connect"** button
2. Choose **"Drivers"** option
3. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
4. Replace `<username>` with your database username
5. Replace `<password>` with your database password (the one you saved!)
6. Add database name at the end: `/phonepe_portal?retryWrites=true&w=majority`

   **Final connection string should look like:**

   ```
   mongodb+srv://phonepe_admin:YourPassword123@cluster0.xxxxx.mongodb.net/phonepe_portal?retryWrites=true&w=majority
   ```

7. **SAVE THIS CONNECTION STRING** - you'll need it in the next part!

---

## Part 2: Deploy Backend to Railway

Railway is recommended because it's easy to use and has a good free tier.

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with GitHub (recommended - connects to your repo easily)
4. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. After login, click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your repository (the one containing this project)
4. Click **"Deploy Now"**

### Step 3: Configure Project Settings

1. Railway will detect your project but it's deploying from root directory
2. You need to tell it to use the `backend` folder:
   - Click on your project
   - Go to **Settings** tab
   - Scroll to **"Root Directory"**
   - Change it to: `backend`
   - Click **"Update"**

### Step 4: Add Environment Variables

1. Still in **Settings**, scroll to **"Variables"** section
2. Click **"+ New Variable"** and add each of these:

   **Variable 1:**

   - Key: `PORT`
   - Value: `5000`
   - Click **"Add"**

   **Variable 2:**

   - Key: `NODE_ENV`
   - Value: `production`
   - Click **"Add"**

   **Variable 3:**

   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://phonepe_admin:YourPassword123@cluster0.xxxxx.mongodb.net/phonepe_portal?retryWrites=true&w=majority`
     (Use the connection string you saved from MongoDB Atlas!)
   - Click **"Add"**

   **Variable 4:**

   - Key: `JWT_SECRET`
   - Value: Generate a random secret (you can use: https://randomkeygen.com/ and copy a "CodeIgniter Encryption Keys")
     Example: `YourSuperSecretJWTKey12345ChangeThisInProduction!`
   - Click **"Add"**

   **Variable 5:**

   - Key: `FRONTEND_URL`
   - Value: Your Vercel frontend URL (e.g., `https://your-app-name.vercel.app`)
     (If you don't know it yet, you can update this later)
   - Click **"Add"**

### Step 5: Deploy

1. Go back to **"Deployments"** tab (or main project view)
2. Railway will automatically deploy when you save environment variables
3. Wait for deployment to complete (shows "Active" status)
4. Once deployed, click on the deployment
5. Find the **"Public Domain"** or **"Generate Domain"** button
6. Click **"Generate Domain"** - Railway will give you a URL like: `your-backend.up.railway.app`
7. **SAVE THIS URL** - you'll need it for Vercel!

### Step 6: Test Your Backend

1. Open a new browser tab
2. Visit: `https://your-backend.up.railway.app/api/health`
3. You should see: `{"status":"OK","message":"Server is running"}`
4. If you see this, your backend is working! ✅

---

## Part 3: Configure Vercel Frontend

Now you need to tell your Vercel frontend where your backend is.

### Step 1: Get Your Backend URL

- Your backend URL from Railway (e.g., `https://your-backend.up.railway.app`)
- Add `/api` to it: `https://your-backend.up.railway.app/api`

### Step 2: Add Environment Variable in Vercel

1. Go to https://vercel.com
2. Select your project
3. Click **"Settings"** (top menu)
4. Click **"Environment Variables"** (left sidebar)
5. Click **"+ Add New"**
6. Enter:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend.up.railway.app/api` (your Railway backend URL + `/api`)
   - **Environments:** Select all (Production, Preview, Development)
7. Click **"Save"**

### Step 3: Redeploy Frontend

1. Go to **"Deployments"** tab in Vercel
2. Click the three dots (`⋯`) on the latest deployment
3. Click **"Redeploy"**
4. Or simply push a new commit to trigger a new deployment

### Step 4: Test

1. Visit your Vercel app URL
2. Try to login
3. It should work now! 🎉

---

## Troubleshooting

### Backend deployment fails

- Check Railway logs (click on deployment → "View Logs")
- Make sure `MONGODB_URI` is correct
- Make sure Root Directory is set to `backend`

### "Cannot connect to MongoDB" error

- Check MongoDB Atlas Network Access - make sure `0.0.0.0/0` is added
- Verify connection string has correct username/password
- Make sure database name is included: `/phonepe_portal`

### Frontend still shows "Failed to fetch"

- Make sure `REACT_APP_API_URL` is set in Vercel
- Make sure you redeployed after adding the variable
- Check browser console for errors
- Verify backend URL is accessible: `https://your-backend.up.railway.app/api/health`

### CORS errors

- Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Make sure it includes `https://`

---

## Quick Reference

### Environment Variables Needed

**Railway (Backend):**

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phonepe_portal?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel (Frontend):**

```
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

---

## Need Help?

If you get stuck at any step, check:

1. Railway deployment logs
2. MongoDB Atlas connection status
3. Browser console for errors
4. Network tab in browser dev tools

Good luck! 🚀
