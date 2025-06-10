import { Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
export default function AdminHomePage() {
  const theme = useTheme();

  return (


    <AdminPageLayout title={'Admin Dashboard'}>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">123</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">456</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">789</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Latest Activity</Typography>
            <Typography variant="body2" color="text.secondary">
              Placeholder for recent orders, new users, or system logs.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    
    </AdminPageLayout >
  );
}
