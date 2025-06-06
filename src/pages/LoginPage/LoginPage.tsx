import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Alert, Stack
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuthStore} from '../../stores/useAuthStore';
import { useRedirect } from '../../context/RedirectContext';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, user, loading } = useAuthStore();
  const { redirectTo, setRedirectTo, message, setMessage } = useRedirect();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(user, 'user in LoginPage');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  // 🔁 Wait for user to be set after login
  useEffect(() => {
    if (user) {
      const target = redirectTo || location.state?.from?.pathname ||
        ['admin', 'superadmin'].includes(user.role) ? '/admin' : '/';
      navigate(target, { replace: true });
      setRedirectTo(null);
    }
  }, [user, redirectTo, location.state, navigate, setRedirectTo]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password); // ✅ will trigger the `user` change above
    } catch (err) {
      setMessage('Invalid email or password');
    }
  };

  return (
    <Box>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField label="Email" {...register('email', { required: true })} />
          <TextField label="Password" type="password" {...register('password', { required: true })} />
          {message && <Alert severity="error">{message}</Alert>}
          <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
