// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  PROCUREMENT_TEAM: 'procurement_team',
  REQUESTOR: 'requestor',
  GUEST: 'guest'
};

// Role-based access control
const ROLE_PERMISSIONS = {
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

module.exports = { USER_ROLES, ROLE_PERMISSIONS };
