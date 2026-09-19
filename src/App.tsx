import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Header from './layouts/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import VacanciesPage from './pages/VacanciesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header user={user ?? undefined} onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/empleados" element={
          <ProtectedRoute>
            <AppLayout>
              <EmployeesPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/vacantes" element={
          <ProtectedRoute>
            <AppLayout>
              <VacanciesPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={
          <div style={{ minHeight: '100vh', background: '#f8fafc', textAlign: 'center', padding: '80px' }}>
            <h2 style={{ color: '#1e293b' }}>404 — Página no encontrada</h2>
            <Link to="/dashboard">Volver al inicio</Link>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;