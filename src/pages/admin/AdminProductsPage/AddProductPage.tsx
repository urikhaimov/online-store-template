import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../../../api/categories';
import { createProduct } from '../../../api/products';
import type { Category } from '../../../types/firebase';

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [] as File[],
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? Array.from(files) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.categoryId) return;
    await createProduct({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      images: form.images,
    });
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      images: [],
    });
    alert('Product added!');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Add Product
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <TextField
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Category"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          select
          fullWidth
          margin="normal"
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <input
          type="file"
          name="images"
          multiple
          onChange={handleChange}
          style={{ marginTop: 16 }}
        />

        <Box mt={3}>
          <Button variant="contained" onClick={handleSubmit}>
            Save Product
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} // src/pages/admin/AdminProductsPage/EditProductPage.tsx
