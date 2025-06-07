// src/pages/admin/AdminProductsPage/AdminProductsPage.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { fetchCategories } from '../../../api/categories';
import { fetchProducts } from '../../../api/products';
import type { Category, Product } from '../../../types/firebase';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin – Products
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate('/admin/products/new')}>
        Add Product
      </Button>

      {categories.map((cat) => {
        const catProducts = products.filter(p => p.categoryId === cat.id);
        if (catProducts.length === 0) return null;

        return (
          <Paper key={cat.id} sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6">{cat.name}</Typography>
            <List>
              {catProducts.map((prod) => (
                <ListItem key={prod.id}>
                  <ListItemText
                    primary={prod.name}
                    secondary={`$${prod.price.toFixed(2)} | Stock: ${prod.stock}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        );
      })}

      {/* Optional: uncategorized fallback */}
      {products.some(p => !p.categoryId) && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Uncategorized</Typography>
          <List>
            {products.filter(p => !p.categoryId).map((prod) => (
              <ListItem key={prod.id}>
                <ListItemText primary={prod.name} secondary={`$${prod.price}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
