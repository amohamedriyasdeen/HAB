import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Outlet } from 'react-router-dom';
import { DashboardLayout, DashboardSidebarPageItem } from '@toolpad/core/DashboardLayout';
import { SideBar } from '../components/layout/AdminLayout/Sidebar';
import { TopBar } from '../components/layout/AdminLayout/Topbar';
import Footer from '../components/layout/AdminLayout/Footer';
import { themeConfig } from '../config/themeConfig';
import { useLocation, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const router = React.useMemo(() => ({
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => {
      if (typeof path === 'string') {
        navigate(path);
      } else {
        navigate(path.pathname || '/');
      }
    },
  }), [location, navigate]);

  return (
    <SideBar router={router}>
      <DashboardLayout
        slots={{ toolbarActions: TopBar }}
        sidebarExpandedWidth={themeConfig.admin.sidebar.expandedWidth}
        renderPageItem={(item, params) => {
          if (!params.mini) return <DashboardSidebarPageItem item={item} />;
          return (
            <Tooltip title={item.title} placement="right" arrow>
              <span>
                <DashboardSidebarPageItem item={item} />
              </span>
            </Tooltip>
          );
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.dark' : 'background.default' }}>
          <Box sx={{ flex: 1 }}>
            <Outlet />
          </Box>
          {themeConfig.admin.needFooter && <Footer />}
        </Box>
      </DashboardLayout>
    </SideBar>
  );
}

export default AdminLayout;
