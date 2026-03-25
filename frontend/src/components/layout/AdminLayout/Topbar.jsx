import * as React from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography, Tooltip } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { colorTheme, themeConfig } from '../../../config/themeConfig';
import { useAuth } from '../../../context/AuthContext';

const settings = ['Profile', 'Dashboard', 'Logout'];

export const TopbarConfig = {
  branding: {
    title: themeConfig.admin.logoText,
    logo: <Box component="img" src={themeConfig.admin.logo} alt="logo" sx={{ width: 32, height: 32, objectFit: 'contain' }} />,
  },
};

export function TopBar() {
  const { mode, setMode } = useColorScheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const profileUrl = user?.profileUrl || undefined;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = async (setting) => {
    handleCloseUserMenu();
    
    if (setting === 'Logout') {
      await logout();
      navigate('/login', { replace: true });
    } else if (setting === 'Profile') {
      navigate('/profile');
    } else if (setting === 'Dashboard') {
      navigate('/');
    }
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {themeConfig.admin.needThemeChange && (
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar 
            alt={user?.userName || 'User'}
            src={profileUrl}
            sx={{ 
              bgcolor: mode === 'dark' ? colorTheme.dark.topbar.avatarBg : colorTheme.light.topbar.avatarBg, 
              color: mode === 'dark' ? colorTheme.dark.topbar.avatarText : colorTheme.light.topbar.avatarText 
            }}
          >
            {!profileUrl && (user?.userName?.[0]?.toUpperCase() || 'U')}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
