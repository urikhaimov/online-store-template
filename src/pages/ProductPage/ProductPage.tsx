import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function ProductPage() {
  const { productId } = useParams();
  const { data: product, isLoading } = useProduct(productId!);

  if (isLoading) return <CircularProgress />;
  if (!product) return <Typography>Product not found.</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4">{product.name}</Typography>
      <Typography>{product.description}</Typography>
      <Typography>Price: ${product.price}</Typography>
      <Typography>Stock: {product.stock}</Typography>
    </Box>
  );
}