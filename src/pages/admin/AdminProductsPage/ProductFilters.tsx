// ProductFilters.tsx
import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Category } from '../../../hooks/useAllCategories';
import { State, Action } from './LocalReducer';

interface ProductFiltersProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  categories: Category[];
}

export default function ProductFilters({ state, dispatch, categories }: ProductFiltersProps) {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" href="/admin/products/add">
          Add Product
        </Button>
        {(state.searchTerm || state.selectedCategoryId || state.createdAfter) && (
          <Button
            variant="outlined"
            color="warning"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search products"
            value={state.searchTerm}
            onChange={(e) =>
              dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
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
    </>
  );
}
