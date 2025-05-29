import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function LoginPage() {
  const { login, signup, user, logout } = useAuth();
  const { register, handleSubmit } = useForm();

  const onLogin = async (data: any) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      alert('Login failed');
    }
  };

  const onSignup = async (data: any) => {
    try {
      await signup(data.email, data.password);
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <Box>
      <Typography variant="h4">Login</Typography>
      {user ? (
        <Box>
          <Typography>Welcome, {user.email}</Typography>
          <Button variant="contained" onClick={logout}>Logout</Button>
        </Box>
      ) : (
        <>
          <form onSubmit={handleSubmit(onLogin)}>
            <TextField label="Email" {...register('email')} fullWidth margin="normal" />
            <TextField label="Password" type="password" {...register('password')} fullWidth margin="normal" />
            <Button type="submit" variant="contained">Login</Button>
          </form>

          <Typography variant="h6" mt={2}>Or Sign Up:</Typography>
          <form onSubmit={handleSubmit(onSignup)}>
            <TextField label="Email" {...register('email')} fullWidth margin="normal" />
            <TextField label="Password" type="password" {...register('password')} fullWidth margin="normal" />
            <Button type="submit" variant="contained">Sign Up</Button>
          </form>
        </>
      )}
    </Box>
  );
}
