import React, { useMemo, useReducer } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardMedia,
  CardContent,
  Link,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Link as RouterLink } from 'react-router-dom';
import { useAllProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/cartStore';
import { localReducer, initialFilterState } from './LocalReducer';

import PageWithStickyFilters from '../../layouts/PageWithStickyFilters'
export default function HomePage() {
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const cart = useCartStore();

  const [state, dispatch] = useReducer(localReducer, initialFilterState);

  const filtered = useMemo(() => {
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

  const grouped = useMemo(() => {
    const byCat: Record<string, typeof products> = {};
    categories.forEach((cat) => {
      byCat[cat.name] = filtered.filter((p) => p.categoryId === cat.id);
    });
    return byCat;
  }, [filtered, categories]);

  const renderFilters = (
    <>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Search products"
          value={state.searchTerm}
          onChange={(e) =>
            dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
          }
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={state.selectedCategoryId}
            label="Category"
            onChange={(e) =>
              dispatch({ type: 'SET_CATEGORY_FILTER', payload: e.target.value })
            }
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <DatePicker
          label="Created After"
          value={state.createdAfter}
          onChange={(date) =>
            dispatch({ type: 'SET_CREATED_AFTER', payload: date })
          }
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Grid>
    </>
  );

  const renderProduct = (product: any) => (
    <Card key={product.id} sx={{ display: 'flex', mb: 2, p: 1 }}>
      <CardMedia
        component="img"
        image={product.imageUrls?.[0] || 'https://picsum.photos/seed/fallback/300/300'}
        alt={product.name}
        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
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
        <Typography>${product.price.toFixed(2)}</Typography>
        <Typography variant="caption">Stock: {product.stock}</Typography>
      </CardContent>
      <Box pr={2}>
        <Button onClick={() => cart.addToCart({ ...product, quantity: 1 })}>
          Add to Cart
        </Button>
      </Box>
    </Card>
  );

  return (
    <PageWithStickyFilters
      title="Products by Category"
      filters={renderFilters}
    >
      {Object.entries(grouped).map(([category, items]) =>
        items.length > 0 ? (
          <Box key={category} mb={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {category}
            </Typography>

            <Stack spacing={2}>
              {items.map((product) => (
                <Card
                  key={product.id}
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.01)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mr: 2,
                    }}
                    image={product.imageUrls?.[0] || 'https://picsum.photos/seed/fallback/100/100'}
                    alt={product.name}
                  />

                  <Box flexGrow={1}>
                    <Link
                      to={`/product/${product.id}`}
                      component={RouterLink}
                      underline="hover"
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                    >
                      {product.name}
                    </Link>

                    <Typography variant="body2" color="text.secondary">
                      ${product.price.toFixed(2)} • Stock: {product.stock}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => cart.addToCart({ ...product, quantity: 1 })}
                  >
                    Add to Cart
                  </Button>
                </Card>
              ))}
            </Stack>
          </Box>
        ) : null
      )}
    </PageWithStickyFilters>

  );
}
