import { Box, TextField, Button, Typography, Paper, Divider, Tooltip, IconButton, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { themeConfig } from '../../config/themeConfig';

const PROVIDER_CONFIG = {
  google: {
    label: 'Google',
    color: '#4285F4',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33.6 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20.3-7.9 20.3-21 0-1.4-.1-2.7-.3-4z"/>
        <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3c-7.6 0-14.2 4.3-17.7 10.7z" transform="translate(0,1)"/>
        <path fill="#FBBC05" d="M24 45c5.5 0 10.5-1.9 14.3-5l-6.6-5.4C29.7 36.1 27 37 24 37c-5.7 0-10.2-3.4-11.7-8.5l-7 5.4C8.8 40.7 15.9 45 24 45z" transform="translate(0,-1)"/>
        <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.3-2.3 4.2-4.3 5.5l6.6 5.4C41.7 36.1 44.5 30.5 44.5 24c0-1.4-.1-2.7-.3-4z"/>
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.3 9-9.3 2.6 0 5.4.5 5.4.5v5.9h-3c-3 0-3.9 1.9-3.9 3.8V24h6.6l-1.1 6.9h-5.6v16.8C39.2 45.9 48 36 48 24z"/>
        <path fill="#fff" d="M33.4 30.9l1.1-6.9h-6.6v-4.4c0-1.9.9-3.8 3.9-3.8h3v-5.9s-2.7-.5-5.4-.5c-5.5 0-9 3.3-9 9.3V24h-6.1v6.9h6.1v16.8c1.2.2 2.5.3 3.7.3s2.5-.1 3.7-.3V30.9h5.6z"/>
      </svg>
    ),
  },
  github: {
    label: 'GitHub',
    color: '#333',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  twitter: {
    label: 'Twitter',
    color: '#1DA1F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#1DA1F2" d="M23.95 4.57a10 10 0 0 1-2.82.77 4.96 4.96 0 0 0 2.16-2.72c-.95.56-2 .96-3.12 1.19a4.92 4.92 0 0 0-8.38 4.49A13.96 13.96 0 0 1 1.64 3.16a4.92 4.92 0 0 0 1.52 6.57 4.9 4.9 0 0 1-2.23-.61v.06a4.92 4.92 0 0 0 3.95 4.83 4.94 4.94 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.02-.63A10 10 0 0 0 24 4.59l-.05-.02z"/>
      </svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#0A66C2" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.27V1.73C24 .77 23.21 0 22.22 0z"/>
      </svg>
    ),
  },
  microsoft: {
    label: 'Microsoft',
    color: '#00A4EF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10.5v10.5H1z"/>
        <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z"/>
        <path fill="#00A4EF" d="M1 12.5h10.5V23H1z"/>
        <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z"/>
      </svg>
    ),
  },
};

function OAuthIcons({ providers }) {
  const theme = useTheme();
  if (!providers.length) return null;
  return (
    <>
      <Divider sx={{ my: 2 }}>
        <Typography variant="caption" color="text.secondary">or continue with</Typography>
      </Divider>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
        {providers.map((provider) => {
          const cfg = PROVIDER_CONFIG[provider] ?? {
            label: provider,
            color: theme.palette.primary.main,
            icon: <Typography sx={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>{provider[0]}</Typography>,
          };
          return (
            <Tooltip key={provider} title={`Continue with ${cfg.label}`} placement="top">
              <IconButton
                onClick={() => authService.oauthRedirect(provider)}
                sx={{
                  width: 44, height: 44,
                  border: '1.5px solid',
                  borderColor: 'divider',
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    borderColor: cfg.color,
                    bgcolor: `${cfg.color}18`,
                  },
                  transition: 'all 0.2s',
                }}
              >
                {cfg.icon}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    </>
  );
}

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const oauthProviders          = authService.getOAuthProviders();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const linkSx = {
    color: theme.palette.primary.main,
    fontSize: 13,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box component="img" src={themeConfig.auth.logo} alt="logo" sx={{ width: 56, height: 56, objectFit: 'contain', mb: 1 }} />
        <Typography variant="h5" fontWeight={600}>Welcome back</Typography>
        <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
      </Box>

      {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center', fontSize: 14 }}>{error}</Typography>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Email" type="email" margin="normal" required
          value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <TextField fullWidth label="Password" type="password" margin="normal" required
          value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

        <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 2.5, mb: 2 }}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            New account?{' '}
            <Box component={Link} to="/register" sx={linkSx}>Register</Box>
          </Typography>
          <Box component={Link} to="/forgot-password" sx={linkSx}>Forgot password?</Box>
        </Box>
      </Box>

      <OAuthIcons providers={oauthProviders} />
    </Paper>
  );
}

export default Login;
