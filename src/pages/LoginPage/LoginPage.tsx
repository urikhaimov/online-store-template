// src/pages/LoginPage/LoginPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
 import { useRedirect } from '../../context/RedirectContext';
import { useSafeAuth } from '../../hooks/getSafeAuth';



type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login } = useSafeAuth();
  const { redirectTo, setRedirectTo, message, setMessage } = useRedirect();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
      setMessage(null); // clear any old message
      navigate(redirectTo || '/');
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
    }
  };

  const handleAdminLogin = () => {
    const email = 'admin@example.com';
    const password = 'adminpass';
    setValue('email', email);
    setValue('password', password);
    handleSubmit(onSubmit)(); // auto-submit
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam) setRedirectTo(redirectParam);
  }, [location.search, setRedirectTo]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Email"
            fullWidth
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            Log In
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleAdminLogin}
          >
            Login as Admin
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
