// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  baseUrl: process.env.REACT_APP_BASE_URL || 'http://localhost:3000',
  scopes: [
    'openid',
    'profile', 
    'email'
  ]
};

// User Roles for PhonePe Procurement Portal
export const USER_ROLES = {
  ADMIN: 'admin',
  PROCUREMENT_TEAM: 'procurement_team',
  REQUESTOR: 'requestor',
  GUEST: 'guest'
};

// Role-based access control
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: {
    canAccessProcurementConsole: true,
    canAccessRequestorConsole: true,
    canAccessDashboard: true,
    canManageUsers: true,
    canViewReports: true,
    canAccessFusion: true,
    canAccessSpotdraft: true,
    canCreatePSR: true,
    canApproveRequests: true
  },
  [USER_ROLES.PROCUREMENT_TEAM]: {
    canAccessProcurementConsole: true,
    canAccessRequestorConsole: false,
    canAccessDashboard: true,
    canManageUsers: false,
    canViewReports: true,
    canAccessFusion: true,
    canAccessSpotdraft: true,
    canCreatePSR: true,
    canApproveRequests: true
  },
  [USER_ROLES.REQUESTOR]: {
    canAccessProcurementConsole: false,
    canAccessRequestorConsole: true,
    canAccessDashboard: false,
    canManageUsers: false,
    canViewReports: false,
    canAccessFusion: false,
    canAccessSpotdraft: false,
    canCreatePSR: true,
    canApproveRequests: false
  },
  [USER_ROLES.GUEST]: {
    canAccessProcurementConsole: false,
    canAccessRequestorConsole: false,
    canAccessDashboard: false,
    canManageUsers: false,
    canViewReports: false,
    canAccessFusion: false,
    canAccessSpotdraft: false,
    canCreatePSR: false,
    canApproveRequests: false
  }
};

// User role assignment (for development)
export const getUserRole = (email) => {
  // For development, assign roles based on email domain or specific emails
  const adminEmails = [
    'admin@phonepe.com', 
    'shanawaz.pinjar@phonepe.com',
    'shantanugondane44@gmail.com' // Your email for testing
  ];
  const procurementEmails = [
    'procurement@phonepe.com', 
    'team@phonepe.com',
    'procurement.team@phonepe.com'
  ];
  
  if (adminEmails.includes(email.toLowerCase())) {
    return USER_ROLES.ADMIN;
  } else if (procurementEmails.includes(email.toLowerCase())) {
    return USER_ROLES.PROCUREMENT_TEAM;
  } else if (email.includes('@phonepe.com')) {
    return USER_ROLES.REQUESTOR;
  } else {
    return USER_ROLES.GUEST;
  }
};
