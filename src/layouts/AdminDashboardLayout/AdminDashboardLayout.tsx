import { NavLink, Outlet } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@mui/material';

export default function AdminDashboardLayout() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: isActive ? '#1976d2' : 'inherit',
    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
    borderRadius: '4px',
    padding: '8px 16px',
    display: 'block',
  });

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '240px', borderRight: '1px solid #ddd' }}>
        <List>
          <ListItem>
            <NavLink to="/admin" style={linkStyle}>
              <ListItemText primary="Dashboard Home" />
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/categories" style={linkStyle}>
              <ListItemText primary="Manage Categories" />
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/users" style={linkStyle}>
              <ListItemText primary="Manage Users" />
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/admin/logs" style={linkStyle}>
              <ListItemText primary="View Logs" />
            </NavLink>
          </ListItem>
        </List>
      </aside>
      <main style={{ flexGrow: 1, padding: '16px' }}>
        <Outlet />
      </main>
    </div>
  );
}
