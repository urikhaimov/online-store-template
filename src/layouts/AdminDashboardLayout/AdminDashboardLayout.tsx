import { ReactNode } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { AppBar, Toolbar, IconButton, Typography, Box, CssBaseline, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const drawerWidth = 240;

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            <Brightness4Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {['Categories', 'Orders', 'Users'].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
