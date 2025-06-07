import { Box, Typography, CircularProgress } from '@mui/material';
import { useAllProducts } from '../../hooks/useProducts';

export default function HomePage() {
  const { data: products, isLoading } = useAllProducts();

  if (isLoading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4">All Products</Typography>
      <ul>
        {(products || []).map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </Box>
  );
}
