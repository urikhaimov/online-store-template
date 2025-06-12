// src/pages/ThankYouPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const orderId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'orders', orderId));
        if (snap.exists()) {
          setOrder(snap.data());
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        textAlign="center"
        px={2}
      >
        <Typography variant="h5" gutterBottom color="error">
          Order not found or invalid ID.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Go Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      textAlign="center"
      px={2}
    >
      <Typography variant="h4" gutterBottom>
        🎉 Thank You for Your Order!
      </Typography>

      {order && (
        <Box my={3}>
          <Typography variant="subtitle1">
            <strong>Name:</strong> {order.fullName}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Email:</strong> {order.email}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Items:</strong>
          </Typography>
          <ul style={{ textAlign: 'left' }}>
            {order.items.map((item: any) => (
              <li key={item.id}>
                {item.name} × {item.quantity} = ${item.price * item.quantity}
              </li>
            ))}
          </ul>
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </Button>
    </Box>
  );
}
