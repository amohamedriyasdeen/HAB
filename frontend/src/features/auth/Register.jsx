import { Box, TextField, Button, Typography, Paper, useTheme } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Register
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 3, mb: 2 }}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Box
              component={Link}
              to="/login"
              sx={{ color: theme.palette.primary.main, fontSize: 13, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Login
            </Box>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default Register;
