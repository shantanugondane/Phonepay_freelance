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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
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

export default apiCall;
