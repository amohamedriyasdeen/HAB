import * as React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { theme } from '../../../config/theme';
import { TopbarConfig } from './Topbar';
import { useAuth } from '../../../context/AuthContext';

// Add `roles` to items that should be restricted. No `roles` = visible to all.
export const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },
  // { segment: 'orders', title: 'Orders', icon: <ShoppingCartIcon /> },
  // { kind: 'divider' },
  // { kind: 'header', title: 'Analytics' },
  // {
  //   segment: 'reports',
  //   title: 'Reports',
  //   icon: <BarChartIcon />,
  //   children: [
  //     { segment: 'sales', title: 'Sales', icon: <DescriptionIcon /> },
  //     { segment: 'traffic', title: 'Traffic', icon: <DescriptionIcon /> },
  //   ],
  // },
  // { segment: 'integrations', title: 'Integrations', icon: <LayersIcon /> },
  { kind: 'divider' },
  { segment: 'users', title: 'Users', icon: <SupervisedUserCircle />, roles: ['super-admin'] },
];

const filterNav = (nav, userRoles) =>
  nav.reduce((acc, item) => {
    if (item.kind) return [...acc, item]; // headers/dividers always included
    if (item.roles && !item.roles.some(r => userRoles.includes(r))) return acc;
    const filtered = item.children
      ? { ...item, children: filterNav(item.children, userRoles) }
      : item;
    return [...acc, filtered];
  }, []);

export function SideBar({ children, router }) {
  const { user } = useAuth();
  const userRoles = user?.roles?.map(r => r.name ?? r) ?? [];
  const navigation = filterNav(NAVIGATION, userRoles);

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={theme}
      branding={TopbarConfig.branding}
    >
      {children}
    </AppProvider>
  );
}

SideBar.propTypes = {
  children: PropTypes.node.isRequired,
  router: PropTypes.object.isRequired,
};
