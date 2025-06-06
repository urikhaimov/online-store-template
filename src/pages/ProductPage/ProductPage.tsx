import React, { useEffect, useReducer } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Container,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { createProduct, updateProduct, deleteProduct } from '../../api/products';
import reducer from './localReducer';
import { State } from './types';
import { Product } from '../../types/firebase';

const initialState: State = {
  products: [],
  loading: true,
  search: '',
};

const ProductListPage: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        dispatch({ type: 'SET_PRODUCTS', payload: productList });
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
    // TODO: Hook into cart context or localStorage
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  const handleUpdate = async (id: string) => {
    const updates = { price: Math.floor(Math.random() * 100) };
    await updateProduct(id, updates);
    dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates } });
  };

  const filteredProducts = state.products.filter(p =>
    p.name?.toLowerCase().includes(state.search.toLowerCase())
  );

  if (state.loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>

      <TextField
        label="Search products"
        variant="outlined"
        fullWidth
        value={state.search}
        onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">Stock: {product.stock}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleUpdate(product.id)}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductListPage;
