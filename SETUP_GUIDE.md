# PhonePe Procurement Portal - Setup Guide

## ✅ What We've Built So Far

### Phase 1 Complete: Custom Authentication System

**Backend:**
- ✅ Express.js server setup
- ✅ MongoDB connection setup
- ✅ User model/schema
- ✅ Authentication APIs (register, login, logout, get current user)
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based permissions

**Frontend:**
- ✅ Removed Google OAuth
- ✅ Updated AuthContext to use custom API
- ✅ New login form (email + password)
- ✅ API utility functions

---

## 🚀 Next Steps - Setup & Run

### 1. Install MongoDB

**Option A: Install MongoDB Locally (Recommended for development)**

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. MongoDB will install as a Windows service and start automatically

**Option B: Use MongoDB Atlas (Cloud - Free, Easier)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 - Free tier)
4. Create database user
5. Get connection string
6. Update `.env` file in backend folder with Atlas connection string

---

### 2. Start Backend Server

**First time setup:**
```bash
cd backend
npm install  # Already done, but run if needed
```

**Create .env file in backend folder:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/phonepe_portal
JWT_SECRET=phonepe_procurement_portal_secret_key_2024
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas, use:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phonepe_portal
```

**Start server:**
```bash
cd backend
npm start
# or for development (auto-restart):
npm run dev
```

Server should start on: http://localhost:5000

---

### 3. Start Frontend

**In a new terminal:**
```bash
npm start
```

Frontend will run on: http://localhost:3000

---

### 4. Test the System

**Create a test user:**

Use Postman, Thunder Client (VS Code), or curl:

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@phonepe.com",
    "password": "password123",
    "name": "Test User",
    "role": "requestor"
  }'
```

**Or login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@phonepe.com",
    "password": "password123"
  }'
```

**Then:**
1. Open http://localhost:3000
2. Click "Login"
3. Enter email and password
4. You should be logged in!

---

## 📋 Available Roles

When registering, use these roles:
- `admin` - Full system access
- `procurement_team` - Procurement console access
- `requestor` - Requestor console access
- `guest` - Read-only access

---

## 🔧 Troubleshooting

**Backend won't start:**
- Check if MongoDB is running (if using local MongoDB)
- Check if port 5000 is available
- Check .env file exists and has correct MongoDB URI

**Can't connect to MongoDB:**
- If local: Make sure MongoDB service is running
- If Atlas: Check connection string, username, password
- Check firewall/network settings

**Login fails:**
- Make sure backend server is running on port 5000
- Check browser console for errors
- Verify user exists in database

**CORS errors:**
- Make sure FRONTEND_URL in .env matches your frontend URL
- Check backend server is running

---

## 📁 Project Structure

```
Phonepay_freelance/
├── backend/              # Backend API server
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── config/          # Configuration
│   └── server.js        # Server entry point
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── contexts/        # React contexts (AuthContext)
│   ├── utils/           # Utility functions (API calls)
│   └── config/          # Frontend config
└── package.json         # Frontend dependencies
```

---

## 🎯 What's Next?

**Phase 2:** Build PSR (Procurement Service Request) APIs
**Phase 3:** Connect frontend components to backend APIs
**Phase 4:** PSR creation and approval workflow

---

## 📝 Notes

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- MongoDB: localhost:27017 (or Atlas cluster)
- Database name: `phonepe_portal`
