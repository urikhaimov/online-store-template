import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthSafe } from '../hooks/useAuthSafe';
import { getSafeAuth } from '../hooks/getSafeAuth';
export default function Navbar() {
const auth = useAuthSafe();

if (!auth) {
  console.log('Not inside AuthProvider');
} else {
  console.log('Logged in as:', auth.user);
}
 const { user, logout } = getSafeAuth();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Online Store
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/cart">
          Cart
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/checkout">
              Checkout
            </Button>
            <Button color="inherit" component={Link} to="/my-orders">
              My Orders
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            {user?.email === 'admin@example.com' && (
              <Button color="inherit" component={Link} to="/admin/orders">
                Admin Orders
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
