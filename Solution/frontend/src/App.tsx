import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { LoginForm } from '@/components/auth/login-form';
import { EventsPage } from '@/pages/events-page';
import { AdminDashboardPage } from '@/pages/admin-dashboard-page';
import { RegistrationList } from '@/components/user/registration-list';
import { Toaster } from '@/components/ui/toaster';
import { ReactNode } from 'react';

const PrivateRoute = ({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/login" />;
  if (requireAdmin && user?.role !== 'ADMIN') return <Navigate to="/" />;

  return children;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <EventsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-registrations"
          element={
            <PrivateRoute>
              <RegistrationList />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
