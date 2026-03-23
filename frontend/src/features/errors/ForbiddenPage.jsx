import { Box, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
      <LockIcon sx={{ fontSize: 64, color: 'error.main' }} />
      <Typography variant="h4" fontWeight="bold">403 - Forbidden</Typography>
      <Typography variant="body1" color="text.secondary">You don't have permission to access this page.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Go to Dashboard</Button>
    </Box>
  );
}
