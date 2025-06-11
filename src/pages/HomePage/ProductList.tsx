// src/pages/HomePage/ProductList.tsx

import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Product, Category } from '../../types/firebase';
import { useCartStore } from '../../store/cartStore';

type Props = {
  products: Product[];
  page: number;
  hasMore: boolean;
  setPage: (val: number) => void;
  categories: Category[];
};

export default function ProductList({ products, page, hasMore, setPage, categories }: Props) {
  const cart = useCartStore();

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const name = categoryMap.get(p.categoryId) || 'Uncategorized';
    if (!acc[name]) acc[name] = [];
    acc[name].push(p);
    return acc;
  }, {});

  return (<Box
    component="section"
    sx={{
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
      px: 2,
      py: 3,
      height: `50vh`,
    }}
  >
    {Object.entries(grouped).map(([category, items]) => (
      <Box key={category} mb={4}>
        <Divider sx={{ mb: 2 }}>
          <Typography variant="h6">{category}</Typography>
        </Divider>
        <Stack spacing={2}>
          {items.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 120, objectFit: 'cover' }}
                  image={p.images?.[0] || '/placeholder.png'}
                  alt={p.name}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {p.description}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${p.price}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  onClick={() => cart.addToCart({ ...p, quantity: 1 })}
                >
                  Add to Cart
                </Button>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Box>
    ))}

    {/* Pagination */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
      <Button
        variant="outlined"
        disabled={page === 1}
        onClick={() => setPage(Math.max(1, page - 1))}
      >
        Previous
      </Button>

      <Typography variant="body2">Page {page}</Typography>

      <Button
        variant="contained"
        disabled={!hasMore}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </Box>

    {!hasMore && products.length > 0 && (
      <Box textAlign="center" py={2}>
        <Typography variant="caption" color="text.secondary">
          No more products to load.
        </Typography>
      </Box>
    )}

    {products.length === 0 && (
      <Typography variant="body2" color="text.secondary">
        No products match your filters.
      </Typography>
    )}
  </Box>
  );
}
