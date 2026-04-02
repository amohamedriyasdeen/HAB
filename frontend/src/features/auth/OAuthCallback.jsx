import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { IS_TOKEN_MODE, tokenStorage } from '../../config/authConfig';

function OAuthCallback({ status }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'error') {
      setError(searchParams.get('message') || 'OAuth login failed.');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
      return;
    }

    if (IS_TOKEN_MODE) {
      const accessToken  = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      if (!accessToken) {
        navigate('/login', { replace: true });
        return;
      }
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    authService.checkAuth()
      .then(data => {
        const user = data?.data?.user;
        if (user) {
          setUser(user);
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      })
      .catch(() => navigate('/login', { replace: true }));
  }, [status, navigate, searchParams, setUser]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CircularProgress />
          <Typography>Completing sign in...</Typography>
        </>
      )}
    </Box>
  );
}

export default OAuthCallback;
