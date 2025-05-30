import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await signup(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      alert('Signup failed: ' + err.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register('email', { required: true })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: true })}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create Account
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
