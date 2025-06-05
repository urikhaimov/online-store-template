import React, { useEffect, useState, KeyboardEvent } from 'react';
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
import { useCategoriesStore } from '../../../stores/useCategoriesStore';
import { useAuthStore } from '../../../stores/useAuthStore';

export default function AdminDashboardPage() {
  const { categories, setCategories, addCategoryToState, removeCategoryFromState } =
    useCategoriesStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  console.log('isAdmin:', isAdmin);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      const mappedData = data.map((doc) => ({
        id: doc.id,
        name: doc.name,
      }));
      setCategories(mappedData);
    }
    loadCategories();
  }, [setCategories]);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const id = await addCategory(newCategory);
      addCategoryToState({ id, name: newCategory });
      setNewCategory('');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    removeCategoryFromState(id);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

 if (user === null) {
  return <Typography>Loading...</Typography>; // waiting for auth load
}

if (user && user.role !== 'admin') {
  return <Typography>You do not have access to this page.</Typography>;
}
  

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard – Categories
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
        {categories.map((cat) => (
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
