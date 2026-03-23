import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { themeConfig } from '../../config/themeConfig';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ password: false, confirmPassword: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return setStatus('invalid');
    authService.verifyResetToken(token)
      .then(() => setStatus('valid'))
      .catch(() => setStatus('invalid'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (field) => setShowPass(p => ({ ...p, [field]: !p[field] }));

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 420, width: '100%', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box component="img" src={themeConfig.auth.logo} alt="logo" sx={{ width: 56, height: 56, objectFit: 'contain', mb: 1.5 }} />
        <Typography variant="h5" fontWeight={700}>Reset Password</Typography>
      </Box>

      {status === 'verifying' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'invalid' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h6" fontWeight={600}>Link Expired or Invalid</Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            This password reset link has expired or is invalid. Please request a new one.
          </Typography>
          <Button fullWidth variant="contained" color="error" sx={{ borderRadius: 2 }} onClick={() => navigate('/forgot-password')}>
            Request New Link
          </Button>
          <Button fullWidth variant="text" onClick={() => navigate('/login')}>← Back to Login</Button>
        </Box>
      )}

      {status === 'valid' && (
        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {['password', 'confirmPassword'].map((field) => (
            <TextField
              key={field} fullWidth margin="normal" required
              label={field === 'password' ? 'New Password' : 'Confirm Password'}
              type={showPass[field] ? 'text' : 'password'}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggle(field)} edge="end" size="small">
                      {showPass[field] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}
          <Button fullWidth variant="contained" type="submit" disabled={loading} size="large" sx={{ mt: 2, borderRadius: 2 }}
            startIcon={<LockResetIcon />}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>
      )}

      {status === 'success' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main' }} />
          <Typography variant="h6" fontWeight={600}>Password Reset Successful!</Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Your password has been updated. You can now log in with your new password.
          </Typography>
          <Button fullWidth variant="contained" size="large" sx={{ borderRadius: 2 }} onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default ResetPassword;
