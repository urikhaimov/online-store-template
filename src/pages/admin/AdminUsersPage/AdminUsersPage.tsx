import React, { useReducer } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../api/firebase';

interface User {
  id: string;
  email: string;
  role: string;
}

interface State {
  confirmOpen: boolean;
  selectedUserId: string | null;
  selectedUserEmail: string | null;
}

const initialState: State = {
  confirmOpen: false,
  selectedUserId: null,
  selectedUserEmail: null,
};

function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'OPEN_CONFIRM':
      return {
        ...state,
        confirmOpen: true,
        selectedUserId: action.payload.id,
        selectedUserEmail: action.payload.email,
      };
    case 'CLOSE_CONFIRM':
      return initialState;
    default:
      return state;
  }
}

export async function fetchUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<User, 'id'>),
  }));
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!state.selectedUserId) return;
    try {
      await deleteDoc(doc(db, 'users', state.selectedUserId));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      dispatch({ type: 'CLOSE_CONFIRM' });
    }
  };

  if (isLoading) return <Box p={4}><CircularProgress /></Box>;
  if (error) return <Typography p={4}>❌ Error loading users</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      <List>
        {users.map((user) => (
          <ListItem key={user.id} divider sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemText
              primary={user.email}
              secondary={`Current role: ${user.role}`}
              sx={{ flex: 1 }}
            />
            <Select
              size="small"
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              sx={{ mr: 2, minWidth: 120 }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="superadmin">Superadmin</MenuItem>
            </Select>
            <IconButton
              onClick={() => dispatch({ type: 'OPEN_CONFIRM', payload: { id: user.id, email: user.email } })}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Confirm Dialog */}
      <Dialog open={state.confirmOpen} onClose={() => dispatch({ type: 'CLOSE_CONFIRM' })}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user <strong>{state.selectedUserEmail}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'CLOSE_CONFIRM' })}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
