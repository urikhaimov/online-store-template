import React, { useMemo, useReducer } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Link,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { useAllProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/cartStore';
import { Link as RouterLink } from 'react-router-dom';
import type { Product } from '../../types/firebase';
import type { Category } from '../../types/firebase';
import {localReducer,initialFilterState, VirtualRow   } from './LocalReducer'


export default function HomePage() {
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const cart = useCartStore();

  const [state, dispatch] = useReducer(localReducer, initialFilterState);

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

  const virtualData = useMemo(() => {
    const grouped: VirtualRow[] = [];
    categories.forEach((category) => {
      const categoryProducts = filteredProducts.filter((p) => p.categoryId === category.id);
      if (categoryProducts.length > 0) {
        grouped.push({ type: 'category', data: category });
        categoryProducts.forEach((product) => {
          grouped.push({ type: 'product', data: product });
        });
      }
    });
    return grouped;
  }, [filteredProducts, categories]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = virtualData[index];

    if (item.type === 'category') {
      const category = item.data as Category;
      return (
        <Box style={style} px={2} py={1}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {category.name}
          </Typography>
        </Box>
      );
    }

    const product = item.data as Product;
    return (
      <Box
        style={style}
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={2}
        py={2}
      >
        <Card sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1, width: '100%' }}>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
            image={product.imageUrls?.[0] || 'https://picsum.photos/seed/fallback/300/300'}
            alt={product.name}
          />
          <CardContent sx={{ flex: 1 }}>
            <Link
              component={RouterLink}
              to={`/product/${product.id}`}
              variant="h6"
              underline="hover"
            >
              {product.name}
            </Link>
            <Typography variant="body2">${product.price.toFixed(2)}</Typography>
            <Typography variant="caption">Stock: {product.stock}</Typography>
          </CardContent>
          <Box pr={2}>
            <Button
              variant="contained"
              size="small"
              onClick={() => cart.addToCart({ ...product, quantity: 1 })}
            >
              Add to Cart
            </Button>
          </Box>
        </Card>
      </Box>
    );
  };

  return (
    <Box px={2} py={4} maxWidth={900} mx="auto">
      <Typography variant="h4" gutterBottom>
        Products by Category
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search products"
            variant="outlined"
            value={state.searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={state.selectedCategoryId}
              label="Category"
              onChange={(e) => dispatch({ type: 'SET_CATEGORY_FILTER', payload: e.target.value })}
            >
              <MenuItem value="">All Categories</MenuItem>
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
            onChange={(newDate) => dispatch({ type: 'SET_CREATED_AFTER', payload: newDate })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>

      {virtualData.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No products match your filters.
        </Typography>
      ) : (
        <List
          height={600}
          itemCount={virtualData.length}
          itemSize={140}
          width="100%"
        >
          {Row}
        </List>
      )}
    </Box>
  );
}