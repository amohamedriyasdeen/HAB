import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.some(r => user.roles?.map(role => role.name ?? role).includes(r))) {
    return <Navigate to="/forbidden" replace />;
  }

  return children ?? <Outlet />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
