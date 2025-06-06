import { useState, useEffect } from 'react';
import { fetchCategories, addCategory, deleteCategory } from '../../../api/categories';
import { Category } from '../../../types/firebase';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load existing categories on mount
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    const newCat = await addCategory(newCategoryName.trim());
    setCategories((prev) => [...prev, newCat]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard – Categories
      </Typography>

      <Box display="flex" mb={2}>
        <TextField
          label="New Category"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={handleKeyPress}
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
