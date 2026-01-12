# VDI Server Setup - Step by Step Guide

## 📍 Current Status

✅ **Completed:**
- Logged into PhonePe VDI server (Guacamole)
- Installed Node.js & npm using NVM (v20.19.6)
- Cloned repository from GitHub
- Installed backend dependencies
- Created MongoDB Atlas cluster
- Created .env file (needs password update)
- Whitelisted server IP (20.204.224.89) in MongoDB Atlas

⏳ **To Do:**
- Update .env file with actual MongoDB password
- Test MongoDB connection
- Start backend server
- Set up and start frontend
- Test the application

---

## 🔧 Step-by-Step Instructions

### Step 1: Update .env File with MongoDB Password

**Location:** `/home/rohit.singh/Phonepay_freelance/backend/.env`

**Current format (needs password):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://shantanugondane44_db_user:YOUR_ACTUAL_PASSWORD@cluster0.fkcvoiy.mongodb.net/phonepe_portal?retryWrites=true&w=majority
JWT_SECRET=phonepe_procurement_portal_secret_key_2024
FRONTEND_URL=http://localhost:3000
```

**Action:** Replace `YOUR_ACTUAL_PASSWORD` with the actual MongoDB Atlas database user password.

**⚠️ Important Notes:**
- If your password contains special characters (like `@`, `#`, `$`, etc.), you need to URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `/` → `%2F`
  - `?` → `%3F`
  - `=` → `%3D`
  - `+` → `%2B`
  - ` ` (space) → `%20`

**Example:**
If your password is `MyP@ss#123`, the connection string should be:
```
mongodb+srv://shantanugondane44_db_user:MyP%40ss%23123@cluster0.fkcvoiy.mongodb.net/phonepe_portal?retryWrites=true&w=majority
```

---

### Step 2: Test MongoDB Connection

**Option A: Test from Backend Server**

```bash
cd /home/rohit.singh/Phonepay_freelance/backend
node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb+srv://shantanugondane44_db_user:YOUR_PASSWORD@cluster0.fkcvoiy.mongodb.net/phonepe_portal?retryWrites=true&w=majority').then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); })"
```

**Option B: Start Backend Server (it will test connection automatically)**

```bash
cd /home/rohit.singh/Phonepay_freelance/backend
npm start
```

**Expected Output (Success):**
```
✅ MongoDB Connected: cluster0-shard-00-00.fkcvoiy.mongodb.net
🚀 Server running on port 5000
```

**If you see errors:**
- ❌ "Authentication failed" → Check password in .env
- ❌ "IP not whitelisted" → Verify IP 20.204.224.89 is whitelisted in Atlas
- ❌ "Network timeout" → Check firewall/network settings

---

### Step 3: Start Backend Server

```bash
cd /home/rohit.singh/Phonepay_freelance/backend
npm start
```

**Keep this terminal open** - the server needs to keep running.

**Test if server is running:**
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK","message":"Server is running"}`

---

### Step 4: Set Up Frontend

**In a NEW terminal window (keep backend running):**

```bash
cd /home/rohit.singh/Phonepay_freelance
npm install
```

**Start frontend:**
```bash
npm start
```

Frontend will open automatically at `http://localhost:3000`

---

### Step 5: Test the Application

1. **Open browser** (on VDI server) and go to: `http://localhost:3000`
2. **Register a test user:**
   - Click "Login" or "Get Started"
   - Use the registration form (if available) or use API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@phonepe.com",
    "password": "password123",
    "name": "Test User",
    "role": "requestor"
  }'
```

3. **Login** with the credentials you created
4. **Verify** you can access the dashboard

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Fails

**Symptoms:**
- Error: "MongoServerError: bad auth"
- Error: "Authentication failed"

**Solutions:**
1. Double-check password in .env file
2. URL-encode special characters in password
3. Verify username: `shantanugondane44_db_user`
4. Check MongoDB Atlas → Database Access → Verify user exists

### Issue 2: IP Not Whitelisted

**Symptoms:**
- Error: "IP not whitelisted" or "Network timeout"

**Solutions:**
1. Go to MongoDB Atlas → Network Access
2. Add IP: `20.204.224.89`
3. Or temporarily allow all IPs: `0.0.0.0/0` (for testing only)

### Issue 3: Port Already in Use

**Symptoms:**
- Error: "EADDRINUSE: address already in use :::5000"

**Solutions:**
```bash
# Find process using port 5000
lsof -i :5000
# or
netstat -tulpn | grep 5000

# Kill the process
kill -9 <PID>
```

### Issue 4: Frontend Can't Connect to Backend

**Symptoms:**
- CORS errors in browser console
- "Network Error" when making API calls

**Solutions:**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check FRONTEND_URL in backend/.env matches frontend URL
3. Check browser console for specific error messages

---

## 📝 Quick Reference Commands

```bash
# Navigate to backend
cd /home/rohit.singh/Phonepay_freelance/backend

# Edit .env file
nano .env
# or
vi .env

# Start backend
npm start

# Test MongoDB connection
node -e "require('dotenv').config(); require('mongoose').connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌', err.message); process.exit(1); })"

# Check if backend is running
curl http://localhost:5000/api/health

# Navigate to frontend
cd /home/rohit.singh/Phonepay_freelance

# Install frontend dependencies
npm install

# Start frontend
npm start
```

---

## 🔐 Security Notes

1. **Never commit .env file** to Git (it should be in .gitignore)
2. **Keep MongoDB password secure** - don't share it
3. **Use strong JWT_SECRET** in production
4. **Restrict MongoDB IP whitelist** to only necessary IPs in production

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify each step was completed correctly
3. Check MongoDB Atlas dashboard for connection logs
4. Review backend/server.js console output for detailed errors

---

## ✅ Checklist

- [ ] .env file updated with correct MongoDB password
- [ ] MongoDB connection tested successfully
- [ ] Backend server starts without errors
- [ ] Backend health check returns OK
- [ ] Frontend dependencies installed
- [ ] Frontend starts successfully
- [ ] Can register/login through UI
- [ ] Application works end-to-end

---

**Last Updated:** Based on VDI server setup session
