import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useAllCategories, Category } from '../../../hooks/useAllCategories';
import { fetchProductsPage } from '../../../hooks/fetchProductsPage';
import { deleteProduct } from '../../../hooks/deleteProduct';
import { Product } from '../../../types/firebase';
import { initialState, reducer } from './LocalReducer';
import ProductAdminCard from './ProductAdminCard';
import ProductFilters from './ProductFilters';

export default function AdminProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { data: categories = [] } = useAllCategories() as { data: Category[] };
  const navigate = useNavigate();

  const loadNextPage = async () => {
    if (state.loading || !state.hasMore) return;
    dispatch({ type: 'SET_LOADING', payload: true });

    const { products: next, lastVisible } = await fetchProductsPage(state.lastDoc, {
      categoryId: state.selectedCategoryId,
      createdAfter: state.createdAfter?.toDate?.(),
    });

    if (state.page === 1) {
      dispatch({ type: 'SET_PRODUCTS', payload: next });
    } else {
      dispatch({ type: 'ADD_PRODUCTS', payload: next });
    }
    dispatch({ type: 'SET_LAST_DOC', payload: lastVisible });
    dispatch({ type: 'SET_HAS_MORE', payload: !!lastVisible });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: [] });
    dispatch({ type: 'SET_LAST_DOC', payload: null });
    dispatch({ type: 'SET_HAS_MORE', payload: true });
    dispatch({ type: 'SET_LOADING', payload: false });
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: '' });
    dispatch({ type: 'SET_PENDING_DELETE', payload: null });
    loadNextPage();
  }, [state.selectedCategoryId, state.createdAfter, state.page]);

  const filteredProducts = useMemo(() => {
    const term = state.searchTerm.toLowerCase();
    return state.products.filter((p) => {
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
  }, [state.products, state]);

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

  const handleUndo = () => {
    if (state.pendingDelete) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      dispatch({ type: 'SET_PRODUCTS', payload: [state.pendingDelete, ...state.products] });
      dispatch({ type: 'SET_PENDING_DELETE', payload: null });
    }
  };
  useEffect(() => {
    loadNextPage();
  }, [state.page]);

  return (
     <AdminStickyPage
      title="Products"
      filters={<ProductFilters state={state} dispatch={dispatch} categories={categories} />}
    >
      <Box
        component="section"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2,
          py: 3,
          height: `50vh`,
        }}
      >
        {Object.entries(groupedProducts).map(([category, items]) => (
          <Box key={category} mb={4}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="h6">{category}</Typography>
            </Divider>
            <Stack spacing={2}>
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, translateY: 12 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductAdminCard
                    product={product}
                    onConfirmDelete={(id) => {
                      const deleted = state.products.find((p) => p.id === id);
                      if (!deleted) return;
                      dispatch({ type: 'REMOVE_PRODUCT', payload: id });
                      dispatch({ type: 'SET_PENDING_DELETE', payload: deleted });
                      deleteTimerRef.current = setTimeout(async () => {
                        try {
                          await deleteProduct(id);
                          dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Product deleted.' });
                        } catch (e) {
                          console.error(e);
                        }
                        dispatch({ type: 'SET_PENDING_DELETE', payload: null });
                      }, 4000);
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Button
          variant="outlined"
          disabled={state.page === 1}
          onClick={() => dispatch({ type: 'DECREMENT_PAGE' })}
        >
          Previous
        </Button>

        <Typography variant="body2">Page {state.page}</Typography>

        <Button
          variant="contained"
          disabled={!state.hasMore}
          onClick={() => dispatch({ type: 'INCREMENT_PAGE' })}
        >
          Next
        </Button>
      </Box>

      {!state.hasMore && filteredProducts.length > 0 && (
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

      <Snackbar
        open={!!state.successMessage}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: 'CLEAR_SUCCESS_MESSAGE' })}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {state.successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!state.pendingDelete}
        autoHideDuration={4000}
        onClose={() => dispatch({ type: 'SET_PENDING_DELETE', payload: null })}
        message={`Deleted "${state.pendingDelete?.name}"`}
        action={
          <Button color="secondary" size="small" onClick={handleUndo}>
            UNDO
          </Button>
        }
      />
    </AdminStickyPage>
  );
}
