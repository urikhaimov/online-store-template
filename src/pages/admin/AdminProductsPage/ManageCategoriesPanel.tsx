import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchCategories, addCategory, deleteCategory } from '../../../api/categories';
import type { Category } from '../../../types/firebase';

interface ManageCategoriesPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ManageCategoriesPanel({ open, onClose }: ManageCategoriesPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Manage Categories</Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="New Category"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddCategory}>Add</Button>
      </Box>

      <List>
        {categories.map((category) => (
          <ListItem
            key={category.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
