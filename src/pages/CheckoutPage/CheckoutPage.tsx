
import { useForm } from 'react-hook-form';
import { useCartStore } from '../../store/cartStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
export default function CheckoutPage() {
  const { register, handleSubmit } = useForm();
  const cart = useCartStore();
 const { user } = useAuth();
  const onSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, 'orders'), {
        ...data,
        items: cart.items,
        total: cart.getTotal(),
        userId: user?.uid,  // ← grab user from auth, not cart
        createdAt: new Date(),
      });
      cart.clearCart();
      alert('Order placed!');
    } catch (err) {
      alert('Checkout failed');
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Checkout</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Full Name" {...register('name')} fullWidth margin="normal" />
        <TextField label="Address" {...register('address')} fullWidth margin="normal" />
        <Button type="submit" variant="contained">
          Place Order
        </Button>
      </form>
    </Box>
  );
}
