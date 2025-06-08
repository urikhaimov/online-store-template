import { NavLink, Outlet } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemText, Typography, Divider } from '@mui/material';
import ThemeToggleButton from '../../components/ThemeToggleButton';
export default function AdminDashboardLayout() {
  const navItems = [
    { label: 'Dashboard Home', to: '/admin' },
    { label: 'Manage Categories', to: '/admin/categories' },
    { label: 'Manage Users', to: '/admin/users' },
    { label: 'View Logs', to: '/admin/logs' },
    { label: 'Manage Products', to: '/admin/products' },
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
          bgcolor: '#fafafa',
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Admin Panel
        </Typography>
         <ThemeToggleButton />
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

      {/* Scrollable main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'hidden',
          height: '100vh',
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
