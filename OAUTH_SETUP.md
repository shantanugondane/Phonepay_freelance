# PhonePe Procurement Portal - OAuth Authentication Setup

## Overview

This document outlines the Google OAuth authentication system implemented for the PhonePe Procurement Portal.

## Features Implemented

### 🔐 Authentication System

- **Google OAuth Integration**: Secure login using Google accounts
- **Role-Based Access Control**: Four user roles with different permissions
- **Session Management**: Persistent login state with localStorage
- **Protected Routes**: Route-level access control based on user permissions

### 👥 User Roles & Permissions

#### 1. **Admin** (`admin`)

- ✅ Full system access
- ✅ Access to all consoles and dashboards
- ✅ User management capabilities
- ✅ All procurement functions

#### 2. **Procurement Team** (`procurement_team`)

- ✅ Access to Procurement Console
- ✅ Fusion and SPOTDRAFT integration
- ✅ PSR creation and approval
- ❌ User management
- ❌ Requestor Console access

#### 3. **Requestor** (`requestor`)

- ✅ Access to Requestor Console
- ✅ PSR creation capabilities
- ✅ Policy and SOP viewing
- ❌ Procurement Console access
- ❌ Approval capabilities

#### 4. **Guest** (`guest`)

- ✅ Read-only access
- ❌ All write operations
- ❌ Console access

### 🛠️ Technical Implementation

#### Files Created/Modified:

1. **`src/config/auth.js`** - OAuth configuration and role definitions
2. **`src/contexts/AuthContext.js`** - Authentication context and state management
3. **`src/components/LoginPage.jsx`** - Login interface with Google OAuth
4. **`src/components/ProtectedRoute.jsx`** - Route protection component
5. **`src/components/UserProfile.jsx`** - User profile and logout functionality
6. **`src/App.jsx`** - Updated with authentication wrapper and protected routes
7. **`src/components/Navbar.jsx`** - Updated with role-based navigation and user profile

#### OAuth Configuration:

- **Client ID**: `851969476504-jeeoe0lh4k9t22t4p7j6elgq06j4m7vm.apps.googleusercontent.com`
- **Redirect URI**: `http://localhost:3000/auth/callback`
- **Scopes**: `openid`, `profile`, `email`

### 🚀 How to Test

1. **Start the application**:

   ```bash
   npm start
   ```

2. **Access the portal**:

   - Visit `http://localhost:3000`
   - Click "Login" or "Get Started"

3. **Google OAuth Flow**:

   - Click "Continue with Google"
   - Select your Google account
   - Grant permissions

4. **Role Assignment** (for development):
   - **Admin**: `admin@phonepe.com`, `shanawaz.pinjar@phonepe.com`
   - **Procurement Team**: `procurement@phonepe.com`, `team@phonepe.com`
   - **Requestor**: Any email with `@phonepe.com` domain
   - **Guest**: Any other email

### 🔧 Role Assignment Logic

The system automatically assigns roles based on email addresses:

```javascript
const getUserRole = (email) => {
  const adminEmails = ["admin@phonepe.com", "shanawaz.pinjar@phonepe.com"];
  const procurementEmails = ["procurement@phonepe.com", "team@phonepe.com"];

  if (adminEmails.includes(email.toLowerCase())) {
    return USER_ROLES.ADMIN;
  } else if (procurementEmails.includes(email.toLowerCase())) {
    return USER_ROLES.PROCUREMENT_TEAM;
  } else if (email.includes("@phonepe.com")) {
    return USER_ROLES.REQUESTOR;
  } else {
    return USER_ROLES.GUEST;
  }
};
```

### 🛡️ Security Features

1. **Token Management**: Secure JWT token handling
2. **Session Persistence**: Login state maintained across browser sessions
3. **Permission Checks**: Component-level access control
4. **Route Protection**: Automatic redirects for unauthorized access
5. **Logout Security**: Complete session cleanup

### 📱 User Interface

- **Modern Login Page**: Clean, professional Google OAuth integration
- **User Profile Dropdown**: Shows user info, role, and logout option
- **Role-Based Navigation**: Navigation items filtered by user permissions
- **Access Denied Pages**: Clear feedback for unauthorized access attempts

### 🔄 Integration with Existing Components

All existing components now work with the authentication system:

- **LandingPage**: Login buttons redirect to OAuth flow
- **Navbar**: Shows user profile and role-based navigation
- **All Consoles**: Protected by role-based access control
- **Dashboard**: Accessible to all authenticated users

### 🚀 Next Steps

1. **Client Integration**: Replace mock role assignment with actual client user management
2. **API Integration**: Connect with client's authentication APIs
3. **Additional Providers**: Add support for other OAuth providers if needed
4. **Enhanced Security**: Implement additional security measures as required

### 📞 Support

For any issues or questions regarding the OAuth implementation, refer to the authentication context and configuration files in the `src/config/` and `src/contexts/` directories.
