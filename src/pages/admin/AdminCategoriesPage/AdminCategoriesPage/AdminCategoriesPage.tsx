import React, { useEffect, useState } from 'react';
import { db } from '../../../../api/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { List, ListItem, ListItemText, Button } from '@mui/material';

interface Category {
  id: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'categories'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Category, 'id'>),
      }));
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <List>
      {categories.map(cat => (
        <ListItem key={cat.id} secondaryAction={
          <Button color="error" onClick={() => handleDelete(cat.id)}>Delete</Button>
        }>
          <ListItemText primary={cat.name} />
        </ListItem>
      ))}
    </List>
  );
}
