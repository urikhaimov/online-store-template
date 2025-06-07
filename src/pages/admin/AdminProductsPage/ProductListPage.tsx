import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { fetchCategories } from '../../../api/categories';
import { useProductsByCategory } from '../../../hooks/useProducts';
import type { Category } from '../../../types/firebase';

export default function ProductListPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Products by Category
      </Typography>

      {categories.length === 0 && <CircularProgress />}

      {categories.map((cat) => {
        const { data: products, isLoading } = useProductsByCategory(cat.id);

        return (
          <Paper key={cat.id} sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {cat.name}
            </Typography>

            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <List>
                {(products || []).map((prod) => (
                  <ListItem key={prod.id}>
                    <ListItemText
                      primary={prod.name}
                      secondary={`$${prod.price} • ${prod.stock} in stock`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <Divider />
          </Paper>
        );
      })}
    </Box>
  );
}