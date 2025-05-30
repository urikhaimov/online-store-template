import React, { useEffect, useState, KeyboardEvent } from 'react';
import { useCategories } from '../../../context/CategoriesContext';
import { useAdmin } from '../../../context/AdminContext';
import {
  fetchCategories,
  addCategory,
  deleteCategory,
} from '../../../api/categories';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminDashboardPage() {
  const { state, dispatch } = useCategories();
  const { isAdmin } = useAdmin();
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      // Ensure data is an array of full Category objects
      const mappedData = data.map(doc => ({
        id: doc.id,
        name: doc.name, // make sure doc has 'name' field!
      }));
      dispatch({ type: 'SET_CATEGORIES', payload: mappedData });
    }
    loadCategories();
  }, [dispatch]);


  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const id = await addCategory(newCategory);
      dispatch({
        type: 'ADD_CATEGORY',
        payload: { id, name: newCategory },
      });
      setNewCategory('');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    dispatch({ type: 'REMOVE_CATEGORY', payload: id });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  if (!isAdmin) {
    return <Typography>You do not have access to this page.</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Categories
      </Typography>

      <Box display="flex" mb={2}>
        <TextField
          label="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
          sx={{ ml: 2 }}
        >
          Add
        </Button>
      </Box>

      <List>
        {state.categories.map((cat) => (
          <ListItem
            key={cat.id}
            secondaryAction={
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDeleteCategory(cat.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={cat.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
