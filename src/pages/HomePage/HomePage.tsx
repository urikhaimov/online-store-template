// src/pages/HomePage/HomePage.tsx
import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Link,
} from '@mui/material';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { useAllProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/cartStore';
import { Link as RouterLink } from 'react-router-dom';
import type { Product } from '../../types/firebase';
import type { Category } from '../../types/firebase';

interface VirtualRow {
  type: 'category' | 'product';
  data: Category | Product;
}

export default function HomePage() {
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const cart = useCartStore();

  const virtualData = useMemo(() => {
    const grouped: VirtualRow[] = [];
    categories.forEach((category) => {
      grouped.push({ type: 'category', data: category });
      const categoryProducts = products.filter((p) => p.categoryId === category.id);
      categoryProducts.forEach((product) => {
        grouped.push({ type: 'product', data: product });
      });
    });
    return grouped;
  }, [products, categories]);

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
     console.log('Image URL:', product.imageUrls?.[0]);
    return (
      <Box style={style} px={2} py={1}>
        <Card sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100 }}
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
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Products by Category
      </Typography>
      <List
        height={600}
        itemCount={virtualData.length}
        itemSize={140}
        width="100%"
      >
        {Row}
      </List>
    </Box>
  );
}
