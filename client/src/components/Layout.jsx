import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineSwitchHorizontal,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineLogout,
  HiOutlineMenu,
} from 'react-icons/hi';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/transactions', label: 'Transactions', icon: HiOutlineSwitchHorizontal },
  { to: '/categories', label: 'Categories', icon: HiOutlineTag },
  { to: '/reports', label: 'Reports', icon: HiOutlineChartBar },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">💰</div>
          <h1>ExpenseIQ</h1>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="link-icon"><Icon /></span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <HiOutlineLogout />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <HiOutlineMenu />
            </button>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}