import { Box, TextField, Button, Typography, Paper, Alert, InputAdornment } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { themeConfig } from '../../config/themeConfig';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 420, width: '100%', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Box component="img" src={themeConfig.auth.logo} alt="logo" sx={{ width: 56, height: 56, objectFit: 'contain', mb: 1.5 }} />
        <Typography variant="h5" fontWeight={700}>Forgot Password</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>Enter your email to receive a reset link</Typography>
      </Box>

      {message ? (
        <Alert severity="success" sx={{ borderRadius: 2 }}>{message}</Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <TextField
            fullWidth label="Email" type="email" margin="normal" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment> }}
          />
          <Button fullWidth variant="contained" type="submit" disabled={loading} size="large" sx={{ mt: 2, borderRadius: 2 }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Box>
      )}

      <Button fullWidth variant="text" sx={{ mt: 1.5 }} onClick={() => navigate('/login')}>
        ← Back to Login
      </Button>
    </Paper>
  );
}

export default ForgotPassword;
