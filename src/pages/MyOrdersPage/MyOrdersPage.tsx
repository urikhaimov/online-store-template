// src/pages/MyOrdersPage/MyOrdersPage.tsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'react-toastify';
import { useSafeAuth } from '../../hooks/getSafeAuth';

/* ---------- Types ---------- */
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  categoryId: string;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
  userId: string;
}

/* ---------- Firestore query ---------- */
const fetchUserOrders = async (uid: string): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), where('userId', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Order, 'id'>;
    return { id: doc.id, ...data };
  });
};

export default function MyOrdersPage() {
  const { user } = useSafeAuth();
  const cart = useCartStore();
  const queryClient = useQueryClient();

  /* ---------- Load user orders ---------- */
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[], Error>({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchUserOrders(user!.id),
    enabled: !!user?.id,
  });

  /* ---------- Cancel order mutation ---------- */
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await deleteDoc(doc(db, 'orders', orderId));
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      toast.success(`Order ${orderId} canceled`);
    },
    onError: (err: any) => {
      toast.error(`Failed to cancel order: ${err.message}`);
    },
  });

  /* ---------- Handlers ---------- */
  const handleReorder = (order: Order) => {
    if (order.items.length === 0) {
      toast.info('No items to reorder.');
      return;
    }

    order.items.forEach((item) => {
      cart.addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        stock: item.stock || 100,
        categoryId: item.categoryId || 'uncategorized',
      });
    });

    toast.success('Items added back to cart!');
  };

  const handleCancel = (orderId: string) => {
    cancelOrderMutation.mutate(orderId);
  };

  /* ---------- Render ---------- */
  if (!user) return <Typography>Loading user...</Typography>;
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error loading orders: {error.message}</Typography>;
  if (!orders || orders.length === 0) return <Typography>No orders found.</Typography>;

  return (
    <Box
      flexGrow={1}
      px={2}
      py={4}
      maxWidth="100vw"
      overflow="hidden"
    >
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Order ID: {order.id}</Typography>
          <Typography variant="body2">
            Date: {new Date(order.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            Total: ${order.total.toFixed(2)}
          </Typography>

          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} — ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>

          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => handleReorder(order)}
          >
            Reorder
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => handleCancel(order.id)}
            disabled={cancelOrderMutation.isPending}
          >
            Cancel Order
          </Button>
        </Paper>
      ))}
    </Box>
  );
}
