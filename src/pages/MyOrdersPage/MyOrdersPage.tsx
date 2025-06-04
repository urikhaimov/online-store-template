import { useAuthSafe } from '../../hooks/useAuthSafe';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { useCartStore } from '../../store/cartStore';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { getSafeAuth } from '../../hooks/getSafeAuth';
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number; // add this for cart compatibility
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
  userId: string;
}

const fetchUserOrders = async (uid: string): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), where('userId', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Order, 'id'>;
    return { id: doc.id, ...data };
  });
};

export default function MyOrdersPage() {
  const { user } = getSafeAuth();
  const cart = useCartStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Order[], Error>({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchUserOrders(user!.id),
    enabled: !!user,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await deleteDoc(doc(db, 'orders', orderId));
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
      toast.success(`Order ${orderId} canceled`);
    },
    onError: (err) => {
      toast.error(`Failed to cancel order: ${err.message}`);
    },
  });

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      cart.addToCart({ ...item, stock: item.stock || 100 }); // fallback stock if missing
    });
    toast.success('Items added back to cart!');
  };

  const handleCancel = (orderId: string) => {
    cancelOrderMutation.mutate(orderId);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error loading orders: {error.message}</Typography>;
  if (!data || data.length === 0) return <Typography>No orders found.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {data.map((order: Order) => (
        <Paper key={order.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Order ID: {order.id}</Typography>
          <Typography variant="body2">Date: {new Date(order.createdAt).toLocaleString()}</Typography>
          <Typography variant="body1">Total: ${order.total.toFixed(2)}</Typography>
          <ul>
            {order.items.map((item: OrderItem) => (
              <li key={item.id}>
                {item.name} x {item.quantity} — ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <Button variant="outlined" onClick={() => handleReorder(order)} sx={{ mr: 1 }}>
            Reorder
          </Button>
          <Button variant="contained" color="error" onClick={() => handleCancel(order.id)}>
            Cancel Order
          </Button>
        </Paper>
      ))}
    </Box>
  );
}
