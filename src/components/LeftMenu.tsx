// LeftMenu.tsx
import { NavLink } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemText,
  useTheme,
} from '@mui/material';

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
  display: 'block',
});

export default function LeftMenu({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <List disablePadding>
      {navItems.map(({ label, to }) => (
        <NavLink key={to} to={to} style={linkStyle}>
          <ListItemButton onClick={onItemClick}>
            <ListItemText primary={label} />
          </ListItemButton>
        </NavLink>
      ))}
    </List>
  );
}
