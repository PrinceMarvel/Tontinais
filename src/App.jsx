import React, { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, LayoutDashboard, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import Logo from './components/Logo';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './context/AuthContext';

// Code-splitting dynamique avec React.lazy pour un chargement instantané sur smartphone
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateGroup = lazy(() => import('./pages/CreateGroup'));
const JoinGroup = lazy(() => import('./pages/JoinGroup'));
const GroupDetails = lazy(() => import('./pages/GroupDetails'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));

function PageFallback() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '50vh', color: 'var(--color-secondary-light)' }}>
      <Loader2 size={36} className="animate-spin" />
    </div>
  );
}

function Home() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '24px 16px' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '560px', width: '100%', padding: '36px 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'center' }}>
          <Logo size={96} showText={true} stacked={true} />
        </div>

        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '28px', fontSize: '1rem', lineHeight: '1.6' }}>
          {t('common.slogan')}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
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

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-success">{t('common.trustAndSecurity')}</span>
          <span className="badge badge-info">{t('common.pwaReady')}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ToastProvider>
      {/* Réinitialisation automatique du scroll au sommet à chaque changement de page */}
      <ScrollToTop />
      <div style={{ minHeight: '100dvh', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main className={`app-main ${isAuthenticated ? 'has-bottom-nav' : ''}`}>
          <Suspense fallback={<PageFallback />}>
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
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
        {/* Navigation Inférieure Mobile (Affichée sur smartphone < 768px pour utilisateurs connectés) */}
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
