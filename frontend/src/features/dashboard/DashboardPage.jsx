import { Box, Typography, Grid, Paper } from '@mui/material';

function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h3">1,234</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h3">567</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Revenue</Typography>
            <Typography variant="h3">$12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Sessions</Typography>
            <Typography variant="h3">89</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
