import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../utils/api';
import CreateUser from './CreateUser';

const PeoplePage = ({ isActive }) => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all'); // 'all', 'admin', 'procurement_team', 'requestor', 'guest'

  const isAdmin = hasPermission('canManageUsers');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await usersAPI.getAll({ search: searchTerm });
      setUsers(response.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isActive) {
      fetchUsers();
    }
  }, [isActive, fetchUsers]);

  useEffect(() => {
    if (isActive && searchTerm !== undefined) {
      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isActive, searchTerm, fetchUsers]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleCreateUserSuccess = () => {
    setShowCreateUser(false);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      fetchUsers();
      closeModal();
    } catch (err) {
      alert(err.message || 'Failed to delete user. Please try again.');
    }
  };

  const handleUpdateSuccess = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'procurement_team': 'Procurement Team',
      'requestor': 'Requestor',
      'guest': 'Guest'
    };
    return roleMap[role] || role;
  };

  const getAvatarColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
      'linear-gradient(135deg, #4ECDC4, #6BDDD6)',
      'linear-gradient(135deg, #45B7D1, #6BCBDF)',
      'linear-gradient(135deg, #E91E63, #F06292)',
      'linear-gradient(135deg, #FF9800, #FFB74D)',
      'linear-gradient(135deg, #607D8B, #78909C)'
    ];
    return colors[index % colors.length];
  };

  // Group users by role for counts
  const usersByRole = {
    admin: users.filter(u => u.role === 'admin'),
    procurement_team: users.filter(u => u.role === 'procurement_team'),
    requestor: users.filter(u => u.role === 'requestor'),
    guest: users.filter(u => u.role === 'guest')
  };

  const filteredUsers = users.filter(user => {
    // Filter by role
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesRole && matchesSearch;
  });

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">People</h1>
          <div className="breadcrumb">Dashboard / People</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAdmin && (
            <button
              className="btn-primary"
              onClick={() => setShowCreateUser(true)}
              style={{
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '500',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>+</span>
              <span>Create User</span>
            </button>
          )}
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search for people by name, email, role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #eee',
        paddingBottom: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSelectedRole('all')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: selectedRole === 'all' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'transparent',
            color: selectedRole === 'all' ? 'white' : '#666',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: selectedRole === 'all' ? '600' : '400',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif",
            transition: 'all 0.2s'
          }}
        >
          All ({users.length})
        </button>
        <button
          onClick={() => setSelectedRole('admin')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: selectedRole === 'admin' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'transparent',
            color: selectedRole === 'admin' ? 'white' : '#666',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: selectedRole === 'admin' ? '600' : '400',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif",
            transition: 'all 0.2s'
          }}
        >
          Admin ({usersByRole.admin.length})
        </button>
        <button
          onClick={() => setSelectedRole('procurement_team')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: selectedRole === 'procurement_team' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'transparent',
            color: selectedRole === 'procurement_team' ? 'white' : '#666',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: selectedRole === 'procurement_team' ? '600' : '400',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif",
            transition: 'all 0.2s'
          }}
        >
          Procurement ({usersByRole.procurement_team.length})
        </button>
        <button
          onClick={() => setSelectedRole('requestor')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: selectedRole === 'requestor' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'transparent',
            color: selectedRole === 'requestor' ? 'white' : '#666',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: selectedRole === 'requestor' ? '600' : '400',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif",
            transition: 'all 0.2s'
          }}
        >
          Requestor ({usersByRole.requestor.length})
        </button>
        <button
          onClick={() => setSelectedRole('guest')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: selectedRole === 'guest' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'transparent',
            color: selectedRole === 'guest' ? 'white' : '#666',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: selectedRole === 'guest' ? '600' : '400',
            fontSize: '14px',
            fontFamily: "'Poppins', sans-serif",
            transition: 'all 0.2s'
          }}
        >
          Guest ({usersByRole.guest.length})
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="tools-grid team-members-grid" style={{ marginTop: '20px' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '40px', 
              textAlign: 'center', 
              color: '#666' 
            }}>
              <p>No users found. {isAdmin && 'Click "Create User" to add a new user.'}</p>
            </div>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={user.id || user._id}
                className="tool-card"
                onClick={() => handleUserClick(user)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="profile-avatar"
                  style={{
                    width: '48px',
                    height: '48px',
                    fontSize: '16px',
                    margin: '0 auto 16px',
                    background: getAvatarColor(index)
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <h3 className="tool-title">{user.name}</h3>
                <p className="tool-description">{getRoleDisplayName(user.role)}</p>
                {user.department && (
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {user.department}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <CreateUser
          onClose={() => setShowCreateUser(false)}
          onSuccess={handleCreateUserSuccess}
        />
      )}

      {/* User Detail Modal */}
      {selectedUser && !showEditModal && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                className="modal-profile-avatar"
                style={{
                  width: '80px',
                  height: '80px',
                  fontSize: '32px',
                  margin: '0 auto 16px',
                  background: getAvatarColor(0),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {getInitials(selectedUser.name)}
              </div>
              <h2 style={{ marginBottom: '8px', color: '#333' }}>{selectedUser.name}</h2>
              <p style={{ color: '#666', marginBottom: '4px' }}>{getRoleDisplayName(selectedUser.role)}</p>
              <p style={{ color: '#999', fontSize: '14px' }}>{selectedUser.email}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              {selectedUser.department && (
                <div style={{ marginBottom: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Department</div>
                  <div style={{ fontWeight: '500', color: '#333' }}>{selectedUser.department}</div>
                </div>
              )}
              {selectedUser.employeeId && (
                <div style={{ marginBottom: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Employee ID</div>
                  <div style={{ fontWeight: '500', color: '#333' }}>{selectedUser.employeeId}</div>
                </div>
              )}
              <div style={{ marginBottom: '12px', padding: '12px', background: '#f5f5f5', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Status</div>
                <div style={{ fontWeight: '500', color: selectedUser.isActive ? '#28a745' : '#dc3545' }}>
                  {selectedUser.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleEdit(selectedUser)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedUser.id || selectedUser._id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUser
          user={selectedUser}
          onClose={closeModal}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

// Edit User Component
const EditUser = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    role: user.role || 'requestor',
    department: user.department || '',
    employeeId: user.employeeId || '',
    isActive: user.isActive !== undefined ? user.isActive : true
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await usersAPI.update(user.id || user._id, formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content create-user-modal" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        
        <h2 style={{ marginBottom: '24px', color: '#333' }}>Edit User</h2>

        {error && (
          <div className="error-message" style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="name" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="role" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: 'white'
              }}
            >
              <option value="requestor">Requestor</option>
              <option value="procurement_team">Procurement Team</option>
              <option value="admin">Admin</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="department" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="employeeId" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500', color: '#333' }}>Active User</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{
                padding: '12px 24px',
                background: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeoplePage;
