import { Box } from "@mui/material";
import { Outlet } from 'react-router-dom';
import { themeConfig } from '../config/themeConfig';

function AuthLayout() {
  const { layoutType, logo, splitImage } = themeConfig.auth;

  if (layoutType === 'split') {
    return (
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${splitImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'block' },
          }}
        />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'background.default',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        overflow: 'auto',
        bgcolor: 'background.default',
      }}
    >
      <Outlet />
    </Box>
  );
}

export default AuthLayout;
