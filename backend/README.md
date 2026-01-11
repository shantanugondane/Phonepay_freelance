# PhonePe Procurement Portal - Backend API

## Setup Instructions

### 1. Install MongoDB

If you don't have MongoDB installed:

**Windows:**
- Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
- Install it
- MongoDB will run as a Windows service automatically

**Or use MongoDB Atlas (Cloud - Free):**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Use the connection string in .env file

### 2. Create .env file

Copy `.env.example` to `.env` and update:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/phonepe_portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/phonepe_portal
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: http://localhost:5000

### 5. API Endpoints

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (requires auth token)
- POST `/api/auth/logout` - Logout (client-side token removal)

**Health Check:**
- GET `/api/health` - Check if server is running

### 6. Testing

Use Postman or Thunder Client (VS Code extension) to test APIs.

**Example Register:**
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@phonepe.com",
  "password": "password123",
  "name": "Test User",
  "role": "requestor"
}
```

**Example Login:**
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@phonepe.com",
  "password": "password123"
}
```
