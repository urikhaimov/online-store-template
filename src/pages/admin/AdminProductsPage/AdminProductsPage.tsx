// src/pages/admin/AdminProductsPage.tsx
import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAllProducts } from '../../../hooks/useProducts';
import { useProductMutations } from '../../../hooks/useProductMutations';

export default function AdminProductsPage() {
  const { data: products = [] } = useAllProducts();
  const { remove } = useProductMutations();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProductId) {
      await remove.mutateAsync(selectedProductId);
      setSuccessMessage('Product deleted successfully');
    }
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  const handleEditClick = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin – Products
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/admin/products/add')}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>

      {products.map((product) => (
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

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
