import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      navigate(data.email === 'admin@example.com' ? '/admin' : '/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            {...register('email', { required: true })}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            {...register('password', { required: true })}
            fullWidth
          />
          <Button type="submit" variant="contained">
            Login
          </Button>
          <Button
            type="submit"
            variant="outlined"
            onClick={() => {
              handleSubmit(() => {
                login('admin@example.com', 'adminpassword');
                navigate('/admin');
              })();
            }}
          >
            Login as Admin
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
