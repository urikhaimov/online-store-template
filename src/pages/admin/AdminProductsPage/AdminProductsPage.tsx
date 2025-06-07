import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AdminProductsPage() {
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin – Products
      </Typography>
      <Button variant="contained" onClick={() => navigate('/admin/products/new')}>
        Add Product
      </Button>
    </Box>
  );
}

