// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('phonepe_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || 'Server returned an invalid response');
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Provide better error messages for network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      if (API_BASE_URL.includes('localhost')) {
        throw new Error('Cannot connect to backend. Please check if the backend server is running and REACT_APP_API_URL is configured correctly.');
      } else {
        throw new Error('Cannot connect to backend server. Please check your internet connection or contact support.');
      }
    }
    
    // Re-throw the error with a more user-friendly message if it doesn't have one
    if (!error.message || error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to reach the server. Please check your connection and try again.');
    }
    
    throw error;
  }
};

// API methods
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => apiCall('/auth/logout', {
    method: 'POST',
  }),

  getCurrentUser: () => apiCall('/auth/me', {
    method: 'GET',
  }),
};

export const usersAPI = {
  create: (userData) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/users${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  getById: (id) => apiCall(`/users/${id}`, {
    method: 'GET',
  }),

  update: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
};

export const psrAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/psr${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  getMyRequests: (status = null) => {
    const query = status ? `?status=${status}` : '';
    return apiCall(`/psr/my-requests${query}`, {
      method: 'GET',
    });
  },

  getPending: () => apiCall('/psr/pending', {
    method: 'GET',
  }),

  getApproved: () => apiCall('/psr/approved', {
    method: 'GET',
  }),

  getById: (id) => apiCall(`/psr/${id}`, {
    method: 'GET',
  }),

  create: (psrData) => apiCall('/psr', {
    method: 'POST',
    body: JSON.stringify(psrData),
  }),

  update: (id, psrData) => apiCall(`/psr/${id}`, {
    method: 'PUT',
    body: JSON.stringify(psrData),
  }),

  submit: (id) => apiCall(`/psr/${id}/submit`, {
    method: 'POST',
  }),

  approve: (id) => apiCall(`/psr/${id}/approve`, {
    method: 'POST',
  }),

  reject: (id, reason) => apiCall(`/psr/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),

  addComment: (id, comment) => apiCall(`/psr/${id}/comment`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  }),

  delete: (id) => apiCall(`/psr/${id}`, {
    method: 'DELETE',
  }),

  getStatistics: () => apiCall('/psr/statistics/summary', {
    method: 'GET',
  }),
};

export const salesforceAPI = {
  /**
   * Get all cases from Salesforce
   * @param {Object} filters - Optional filters (status, caseNumber, requestorName, vendorName)
   */
  getCases: (filters = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
    ).toString();
    return apiCall(`/salesforce/cases${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  /**
   * Get a single case by case number
   * @param {string} caseNumber - Case number (e.g., "PSR-12590")
   */
  getCaseByNumber: (caseNumber) => apiCall(`/salesforce/cases/${caseNumber}`, {
    method: 'GET',
  }),

  /**
   * Test Salesforce connection (Admin only)
   */
  testConnection: () => apiCall('/salesforce/test', {
    method: 'GET',
  }),
};

export default apiCall;
