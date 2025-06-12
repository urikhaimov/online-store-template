// src/pages/MyOrdersPage/MyOrdersPage.tsx
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '../../stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';

type Order = {
  id: string;
  createdAt: any; // Firestore Timestamp
  items: { name: string; quantity: number; price: number }[];
  total: number;
  email: string;
  status?: string;
};

async function fetchUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[];
}

const MyOrdersPage = () => {
  const { user } = useAuthStore();

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ['my-orders', user?.uid],
    queryFn: () => fetchUserOrders(user!.uid),
    enabled: !!user,
  });

  useEffect(() => {
    if (user) refetch();
  }, [user]);

  if (!user) return null;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Failed to load orders.</Typography>}
      {!isLoading && !orders.length && (
        <Typography>No orders found.</Typography>
      )}

      {orders.map((order) => (
        <Card key={order.id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Order #{order.id}</Typography>
            <Typography variant="body2" color="text.secondary">
              {order.email} • {format(order.createdAt?.toDate?.() ?? new Date(), 'PPPpp')}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
              Total: ${order.total.toFixed(2)}
            </Typography>
            <List dense>
              {order.items.map((item, idx) => (
                <ListItem key={idx} disableGutters>
                  <ListItemText
                    primary={`${item.name} × ${item.quantity}`}
                    secondary={`$${(item.price * item.quantity).toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ mt: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Status: {order.status || 'processing'}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MyOrdersPage;
