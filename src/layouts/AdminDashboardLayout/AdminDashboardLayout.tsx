import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import LeftMenu from '../../components/LeftMenu';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

export default function AdminDashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar at the top */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            My Online Store
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer: mobile (temporary) and desktop (permanent) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin menu"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar /> {/* For spacing below AppBar */}
          <Divider />
          <LeftMenu onItemClick={isMobile ? handleDrawerToggle : undefined} />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> {/* Push content below AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}
