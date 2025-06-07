import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../../api/categories';
import { getProductById, updateProduct } from '../../../api/products';
import type { Category, Product } from '../../../types/firebase';

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
    if (productId) {
      getProductById(productId).then((prod) => {
        if (prod) {
          setProduct(prod);
          setForm({
            name: prod.name,
            description: prod.description,
            price: String(prod.price),
            stock: String(prod.stock),
            categoryId: prod.categoryId,
          });
        }
      });
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!productId) return;
    await updateProduct(productId, {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
    });
    navigate('/admin/products');
  };

  if (!product) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Edit Product
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

        <Box mt={3}>
          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
