import {
  Box,

  TextField,
  Button,

  CircularProgress,
  Card, CardContent, CardHeader
} from '@mui/material';



interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutPageProps {
  items: CartItem[];
  total: number;
  onSubmit: () => void;
  loading: boolean;
  success: boolean;
  register: any;
  errors: any;
  handleSubmit: any;
}
export default function CheckoutPage({ items = [], total = 0, onSubmit, loading, success, register, errors, handleSubmit }: CheckoutPageProps) {
  return (
    <Box
      flexGrow={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      py={4}
      sx={{
        width: '100%', // Safe
        maxWidth: '100vw', // Prevent overflow
        overflowX: 'hidden', // Enforced here too
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          mx: 'auto',
          boxShadow: 3,
        }}
      >
        <CardHeader title="Payment Details (Mock Stripe)" />
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField label="Name on Card" fullWidth {...register('name')} />
            <TextField label="Card Number" fullWidth {...register('cardNumber')} />
            <TextField label="Expiration Date (MM/YY)" fullWidth {...register('expiry')} />
            <TextField label="CVV" fullWidth {...register('cvv')} />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay with Stripe (Mock)'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
