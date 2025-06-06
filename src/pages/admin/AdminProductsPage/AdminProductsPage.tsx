import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import AddProductDialog from './AddProductDialog';

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Add Product</Button>
      <AddProductDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
