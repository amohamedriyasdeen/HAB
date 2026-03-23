import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center',
      p: 3
    }}>
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>404</Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>Page Not Found</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </Box>
  );
}

export default NotFoundPage;
