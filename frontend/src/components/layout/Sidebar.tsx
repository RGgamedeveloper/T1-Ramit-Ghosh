import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/quizzes', icon: '📝', label: 'Quizzes' },
  { to: '/history', icon: '📋', label: 'History' },
];

const adminNavItems = [
  { to: '/admin/create-quiz', icon: '➕', label: 'Create Quiz' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" id="sidebar-nav">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">Q</div>
        <span className="sidebar-title">Quiz Portal</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id={`nav-${item.label.toLowerCase()}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}

        {/* Admin section */}
        {user?.is_admin && (
          <>
            <div className="sidebar-section-label">Admin</div>
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} />
            ) : (
              <span>{user?.first_name?.[0] || 'U'}</span>
            )}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.full_name || 'User'}</span>
            <span className="sidebar-user-email">{user?.email || ''}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm w-full" onClick={handleLogout} id="logout-btn">
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
