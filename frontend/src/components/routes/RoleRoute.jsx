import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import ForbiddenPage from '../../features/errors/ForbiddenPage';

function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  const userRoles = user?.roles?.map(r => r.name ?? r) ?? [];
  const hasAccess = roles.some(r => userRoles.includes(r));
  return hasAccess ? children : <ForbiddenPage />;
}

RoleRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleRoute;
