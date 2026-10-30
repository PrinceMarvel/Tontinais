import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Logo from './components/Logo';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import JoinGroup from './pages/JoinGroup';
import GroupDetails from './pages/GroupDetails';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'grid', placeItems: 'center', padding: '24px 20px' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '560px', width: '100%', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
          <Logo size={96} showText={true} stacked={true} />
        </div>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {t('common.slogan')}
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
              <LayoutDashboard size={20} />
              <span>{t('nav.dashboard')}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                <LogIn size={18} />
                <span>{t('auth.submitLogin')}</span>
              </Link>
              <Link to="/register" className="btn btn-secondary">
                <UserPlus size={18} />
                <span>{t('auth.submitRegister')}</span>
              </Link>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-success">{t('common.trustAndSecurity')}</span>
          <span className="badge badge-info">{t('common.pwaReady')}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/create"
              element={
                <ProtectedRoute allowedRoles={['CHEF_DE_TONTINE', 'SUPER_ADMIN']}>
                  <CreateGroup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/join"
              element={
                <ProtectedRoute>
                  <JoinGroup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/:id"
              element={
                <ProtectedRoute>
                  <GroupDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}
