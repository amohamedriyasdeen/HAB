import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { themeConfig } from './config/themeConfig';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CssBaseline } from '@mui/material';
import DashboardPage from './features/dashboard/DashboardPage';
import UsersPage from './features/users/UsersPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import NotFoundPage from './features/errors/NotFoundPage';
import ForbiddenPage from './features/errors/ForbiddenPage';
import ProfilePage from './features/profile/ProfilePage';
import OAuthCallback from './features/auth/OAuthCallback';
import { Box, Typography } from '@mui/material';

function OrdersPage() {
  return <Box sx={{ p: 3 }}><Typography variant="h4">Orders</Typography></Box>;
}

function ReportsPage() {
  return <Box sx={{ p: 3 }}><Typography variant="h4">Reports</Typography></Box>;
}

function SalesPage() {
  return <Box sx={{ p: 3 }}><Typography variant="h4">Sales Report</Typography></Box>;
}

function TrafficPage() {
  return <Box sx={{ p: 3 }}><Typography variant="h4">Traffic Report</Typography></Box>;
}

function IntegrationsPage() {
  return <Box sx={{ p: 3 }}><Typography variant="h4">Integrations</Typography></Box>;
}

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Toaster position={themeConfig.admin.toasterPosition} />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth/success" element={<OAuthCallback status="success" />} />
          <Route path="/oauth/error" element={<OAuthCallback status="error" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/users" element={<ProtectedRoute roles={['super-admin']}><UsersPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/sales" element={<SalesPage />} />
            <Route path="/reports/traffic" element={<TrafficPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
