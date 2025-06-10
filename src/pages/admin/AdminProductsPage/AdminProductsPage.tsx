import React, { useEffect, useMemo, useReducer } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { fetchProductsPage } from '../../../hooks/fetchProductsPage';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import { Product } from '../../../types/firebase';
import { initialState, reducer, State } from './LocalReducer';
import { useAllCategories, Category } from '../../../hooks/useAllCategories';

export default function AdminProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [products, setProducts] = useReducer(
    (prev: Product[], next: Product[] | ((prev: Product[]) => Product[])) =>
      typeof next === 'function' ? next(prev) : [...prev, ...next],
    []
  );
  const [lastDoc, setLastDoc] = useReducer((_prev: any, next: any) => next, null);
  const [loading, setLoading] = useReducer((_prev: boolean, next: boolean) => next, false);
  const [hasMore, setHasMore] = useReducer((_prev: boolean, next: boolean) => next, true);

  const { data: categories = [] } = useAllCategories() as { data: Category[] };
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 1 });

  const loadNextPage = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { products: next, lastVisible } = await fetchProductsPage(lastDoc);
    setProducts((prev) => [...prev, ...next]);
    setLastDoc(lastVisible);
    setHasMore(!!lastVisible);
    setLoading(false);
  };

  useEffect(() => {
    loadNextPage();
  }, []);

  useEffect(() => {
    if (inView) {
      loadNextPage();
    }
  }, [inView]);

  const handleDelete = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Product deleted successfully' });

    // ✅ Close the dialog
    dispatch({ type: 'CLOSE_DELETE_DIALOG' });
  };

  const filteredProducts = useMemo(() => {
    const term = state.searchTerm.toLowerCase();
    return products.filter((p) => {
      const matchesText =
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);
      const matchesCategory =
        !state.selectedCategoryId || p.categoryId === state.selectedCategoryId;
      const matchesDate =
        !state.createdAfter ||
        (p.createdAt?.toDate?.() &&
          p.createdAt.toDate().getTime() >= state.createdAfter.valueOf());
      return matchesText && matchesCategory && matchesDate;
    });
  }, [products, state]);

  const groupedProducts = useMemo(() => {
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const acc: Record<string, Product[]> = {};
    for (const product of filteredProducts) {
      const categoryName = categoryMap.get(product.categoryId) || 'Uncategorized';
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(product);
    }
    return acc;
  }, [filteredProducts, categories]);

  return (
    <AdminPageLayout title="Products">
      <Button
        variant="contained"
        onClick={() => navigate('/admin/products/add')}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search products"
            variant="outlined"
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={state.selectedCategoryId}
              label="Category"
              onChange={(e) =>
                dispatch({ type: 'SET_CATEGORY_FILTER', payload: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            label="Created After"
            value={state.createdAfter}
            onChange={(newDate) =>
              dispatch({ type: 'SET_CREATED_AFTER', payload: newDate })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>

      {Object.entries(groupedProducts).map(([category, items]) => (
        <Box key={category} mb={4}>
          <Divider sx={{ mb: 2 }} textAlign="left">
            <Typography variant="h6">{category}</Typography>
          </Divider>
          {items.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
                  image={product.imageUrls?.[0] || 'https://picsum.photos/seed/fallback/100/100'}
                  alt={product.name}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${product.price.toFixed(2)} • Stock: {product.stock}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => dispatch({ type: 'OPEN_DELETE_DIALOG', payload: product.id })}>

                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>
      ))}

      {hasMore && (
        <Box ref={ref} display="flex" justifyContent="center" py={3}>
          {loading && <CircularProgress size={24} />}
        </Box>
      )}

      {!hasMore && filteredProducts.length > 0 && (
        <Box textAlign="center" py={2}>
          <Typography variant="caption" color="text.secondary">
            No more products to load.
          </Typography>
        </Box>
      )}

      {filteredProducts.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No products match your filters.
        </Typography>
      )}

      <Dialog open={state.deleteDialogOpen} onClose={() => dispatch({ type: 'CLOSE_DELETE_DIALOG' })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_DELETE_DIALOG' })}>Cancel</Button>
          <Button
            onClick={() => handleDelete(state.selectedProductId!)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!state.successMessage}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: 'CLEAR_SUCCESS_MESSAGE' })}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {state.successMessage}
        </Alert>
      </Snackbar>
    </AdminPageLayout>
  );
}