import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getSafeAuth } from '../../hooks/getSafeAuth';

export default function LoginPage() {
  const { login, signup, user, logout } = getSafeAuth();
  const loginForm = useForm();
  const signupForm = useForm();

  const onLogin = async (data: any) => {
    try {
      await login(data.email, data.password);
      loginForm.reset();
      alert('Login successful!');
    } catch (err: any) {
      console.error('Login error:', err.code, err.message);
      alert(`Login failed: ${err.message}`);
    }
  };

  const onSignup = async (data: any) => {
    try {
      await signup(data.email, data.password);
      signupForm.reset();
      alert('Signup successful!');
    } catch (err: any) {
      console.error('Signup error:', err.code, err.message);
      alert(`Signup failed: ${err.message}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      {user ? (
        <Box>
          <Typography>Welcome, {user?.firebaseUser.email}</Typography>
          <Button variant="contained" color="secondary" onClick={logout} sx={{ mt: 2 }}>
            Logout
          </Button>
        </Box>
      ) : (
        <>
          <form onSubmit={loginForm.handleSubmit(onLogin)}>
            <TextField
              label="Email"
              {...loginForm.register('email')}
              fullWidth
              margin="normal"
              type="email"
              required
            />
            <TextField
              label="Password"
              type="password"
              {...loginForm.register('password')}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
              Login
            </Button>
          </form>

          <Typography variant="h6" mt={3}>
            Or Sign Up:
          </Typography>

          <form onSubmit={signupForm.handleSubmit(onSignup)}>
            <TextField
              label="Email"
              {...signupForm.register('email')}
              fullWidth
              margin="normal"
              type="email"
              required
            />
            <TextField
              label="Password"
              type="password"
              {...signupForm.register('password')}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
              Sign Up
            </Button>
          </form>
        </>
      )}
    </Box>
  );
}
