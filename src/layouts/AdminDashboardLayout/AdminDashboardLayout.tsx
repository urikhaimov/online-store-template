import { NavLink, Outlet } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import Footer from '../../components/Footer';

export default function AdminDashboardLayout() {
  const navItems = [
    { label: 'Dashboard Home', to: '/admin' },
    { label: 'Manage Categories', to: '/admin/categories' },
    { label: 'Manage Users', to: '/admin/users' },
    { label: 'View Logs', to: '/admin/logs' },
    { label: 'Manage Products', to: '/admin/products' },
    { label: 'Theme Manager', to: '/admin/theme' },
  ];

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: isActive ? '#1976d2' : 'inherit',
    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
    borderRadius: '4px',
  });

  return (
    <Box display="flex" height="100vh" overflow="hidden">
      {/* Sidebar */}
      <Box
        component="aside"
        sx={{
          width: 240,
          minWidth: 240,
          borderRight: '1px solid #ddd',
          bgcolor: 'background.paper',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Admin Panel
          </Typography>

      

          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {navItems.map(({ label, to }) => (
              <NavLink key={to} to={to} style={linkStyle}>
                <ListItemButton>
                  <ListItemText primary={label} />
                </ListItemButton>
              </NavLink>
            ))}
          </List>
        </Box>

        
      </Box>

      {/* Main content and footer */}
      <Box
        component="main"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        height="100vh"
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
          <Outlet />
        </Box>

       
      </Box>
    </Box>
  );
}
