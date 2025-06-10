import React, { useMemo, useReducer } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAllProducts } from '../../../hooks/useProducts';
import { useProductMutations } from '../../../hooks/useProductMutations';
import { useAllCategories, Category } from '../../../hooks/useAllCategories';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import { initialState, reducer } from './LocalReducer';
import { Product } from '../../../types/firebase';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

export default function AdminProductsPage() {
  const { data: products = [] } = useAllProducts();
  const { remove } = useProductMutations();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: categories = [] } = useAllCategories() as { data: Category[] };

  const handleDeleteClick = (productId: string) => {
    dispatch({ type: 'OPEN_DELETE_DIALOG', payload: productId });
  };

  const confirmDelete = async () => {
    if (state.selectedProductId) {
      await remove.mutateAsync(state.selectedProductId);
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Product deleted successfully' });
    }
    dispatch({ type: 'CLOSE_DELETE_DIALOG' });
  };

  const handleEditClick = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
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
        (p.createdAt instanceof Timestamp &&
       p.createdAt.toDate().getTime() >= state.createdAfter.valueOf())

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

      <TextField
        fullWidth
        label="Search products"
        variant="outlined"
        value={state.searchTerm}
        onChange={(e) =>
          dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="category-filter-label">Filter by Category</InputLabel>
        <Select
          labelId="category-filter-label"
          value={state.selectedCategoryId}
          label="Filter by Category"
          onChange={(e) =>
            dispatch({ type: 'SET_CATEGORY_FILTER', payload: e.target.value })
          }
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label="Created After"
        value={state.createdAfter}
        onChange={(newDate) =>
          dispatch({ type: 'SET_CREATED_AFTER', payload: newDate })
        }
        slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
      />

      {Object.entries(groupedProducts).map(([category, items]) => (
        <Box key={category} mb={4}>
          <Typography variant="h6" gutterBottom>
            {category}
          </Typography>
          {items.map((product) => (
            <Card key={product.id} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100 }}
                image={product.imageUrls?.[0] || 'https://picsum.photos/seed/fallback/100/100'}
                alt={product.name}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">${product.price.toFixed(2)}</Typography>
                <Typography variant="caption">Stock: {product.stock}</Typography>
              </CardContent>
              <Box pr={2}>
                <IconButton onClick={() => handleEditClick(product.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteClick(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      ))}

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
          <Button onClick={confirmDelete} color="error" variant="contained">
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
